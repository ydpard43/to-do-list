export const TASK_LIST_CONFIG = Object.freeze({
    TEXTS: {
      NO_CATEGORY: 'Sin categoría asignada',
      DELETE_CONFIRM_TITLE: '¿Eliminar actividad?',
      DELETE_CONFIRM_MESSAGE:
        '¿Seguro que deseas borrar la actividad "{title}" de la categoría "{category}"?',
      DELETE_CANCELLED: 'Se canceló la eliminación',
    },
    BUTTONS: {
      DELETE: {
        LABEL: 'Eliminar',
        SLOT: 'end',
        COLOR: 'danger',
      },
      CANCEL: {
        LABEL: 'Cancelar',
      },
    },
    CHECKBOX: {
      STATUS_TOGGLE: {
        SLOT: 'start',
      },
    },
    STATUS: {
      PENDING: 'PENDING',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETED: 'COMPLETED',
      CANCELED: 'CANCELED',
    },
  });  