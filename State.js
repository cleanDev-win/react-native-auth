const initialState = {
  user: null,
  appointments: [],
  perks: [],
  defaultPerkImage: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { id: action.id, ...action.user },
      };
    case 'ADD_PERK':
      return {
        ...state,
        perks: [...state.perks, { id: action.id, ...(action.perk) }]
      }
    case 'MODIFY_PERK':
      {
        const updatedPerks = state.perks.map(perk => { if (perk.id == action.id) { perk = { id: action.id, ...action.perk } } return perk });
        return Object.assign({}, state, { perks: updatedPerks });
      }
    case 'DELETE_PERK':
      {
        const updatedPerks = state.perks.filter(perk => perk.id !== action.id);
        return Object.assign({}, state, { perks: updatedPerks });
      }
    case 'SET_PERK':
      const updatedAppointments = state.appointments.map((appointment) => { if (appointment.id == action.appointmentId) { appointment.perk = action.perkId; } return appointment; });
      return Object.assign({}, state, { appointments: updatedAppointments });
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [...state.appointments, { id: action.id, ...(action.appointment) }]
      }
    case 'ADD_DEFAULT_PERK_IMAGE':
      return {
        ...state,
        defaultPerkImage: action.url,
      }
    default:
      return state;
  }
};

export function setUser(id, user) {
  return {
    type: 'SET_USER',
    id,
    user,
  };
};

export function addPerk(id, perk) {
  return {
    type: 'ADD_PERK',
    id,
    perk,
  };
};

export function modifyPerk(id, perk) {
  return {
    type: 'MODIFY_PERK',
    id,
    perk,
  };
};

export function deletePerk(id) {
  return {
    type: 'DELETE_PERK',
    id,
  };
};

export function setPerk(appointmentId, perkId) {
  return {
    type: 'SET_PERK',
    appointmentId,
    perkId
  };
};

export function addAppointment(id, appointment) {
  return {
    type: 'ADD_APPOINTMENT',
    id,
    appointment,
  };
};

export function addDefaultPerkImage(url) {
  return {
    type: 'ADD_DEFAULT_PERK_IMAGE',
    url,
  };
};
