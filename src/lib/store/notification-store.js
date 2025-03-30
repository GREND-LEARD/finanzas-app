import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  BUDGET: 'budget',
  GOAL: 'goal',
  TRANSACTION: 'transaction',
};

// Store para manejar las notificaciones
export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isOpen: false,
      
      // Añadir una nueva notificación
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now(),
          timestamp: new Date(),
          read: false,
          ...notification,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
        
        // Auto-eliminar notificaciones temporales después de 5 segundos
        if (notification.temporary) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, 5000);
        }
        
        return newNotification.id;
      },
      
      // Marcar una notificación como leída
      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification && !notification.read) {
            return {
              notifications: state.notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
              ),
              unreadCount: state.unreadCount - 1,
            };
          }
          return state;
        });
      },
      
      // Marcar todas las notificaciones como leídas
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },
      
      // Eliminar una notificación
      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: notification && !notification.read 
              ? state.unreadCount - 1 
              : state.unreadCount,
          };
        });
      },
      
      // Eliminar todas las notificaciones
      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },
      
      // Alternar panel de notificaciones
      toggleNotificationPanel: () => {
        set((state) => ({
          isOpen: !state.isOpen,
        }));
      },
      
      // Cerrar panel de notificaciones
      closeNotificationPanel: () => {
        set({
          isOpen: false,
        });
      },
      
      // Crear una notificación para un presupuesto excedido
      createBudgetAlert: (budget, currentAmount, limit) => {
        const percentage = (currentAmount / limit) * 100;
        let type = NOTIFICATION_TYPES.INFO;
        let message = '';
        
        if (percentage >= 100) {
          type = NOTIFICATION_TYPES.ERROR;
          message = `Has excedido tu presupuesto de ${budget.name}`;
        } else if (percentage >= 80) {
          type = NOTIFICATION_TYPES.WARNING;
          message = `Estás cerca de alcanzar tu límite en el presupuesto de ${budget.name}`;
        }
        
        if (message) {
          get().addNotification({
            title: 'Alerta de Presupuesto',
            message,
            type: NOTIFICATION_TYPES.BUDGET,
            importance: type,
            data: {
              budgetId: budget.id,
              percentage,
              currentAmount,
              limit,
            },
          });
        }
      },
      
      // Crear una notificación para una meta próxima a completarse
      createGoalAlert: (goal) => {
        const percentage = (goal.current_amount / goal.target_amount) * 100;
        
        if (percentage >= 100) {
          get().addNotification({
            title: '¡Meta alcanzada!',
            message: `Has alcanzado tu meta: ${goal.name}`,
            type: NOTIFICATION_TYPES.GOAL,
            importance: NOTIFICATION_TYPES.SUCCESS,
            data: {
              goalId: goal.id,
              percentage,
            },
          });
        } else if (percentage >= 90) {
          get().addNotification({
            title: 'Meta cerca de completarse',
            message: `Estás muy cerca de alcanzar tu meta: ${goal.name}`,
            type: NOTIFICATION_TYPES.GOAL,
            importance: NOTIFICATION_TYPES.INFO,
            data: {
              goalId: goal.id,
              percentage,
            },
          });
        }
      },
      
      // Crear notificación para transacción inusual
      createTransactionAlert: (transaction, reason) => {
        get().addNotification({
          title: 'Transacción inusual detectada',
          message: `Detectamos una transacción inusual: ${transaction.description}`,
          type: NOTIFICATION_TYPES.TRANSACTION,
          importance: NOTIFICATION_TYPES.WARNING,
          data: {
            transactionId: transaction.id,
            amount: transaction.amount,
            reason,
          },
        });
      },
      
      // Crear notificaciones de recordatorio
      createReminder: (title, message, date) => {
        get().addNotification({
          title,
          message,
          type: NOTIFICATION_TYPES.INFO,
          importance: NOTIFICATION_TYPES.INFO,
          reminder: true,
          reminderDate: date,
        });
      },
    }),
    {
      name: 'finanzas-app-notifications',
    }
  )
); 