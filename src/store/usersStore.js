import { create } from 'zustand'
import { persist } from 'zustand/middleware'

//! Toda esta vaina son estados globales
export const useUsersStore = create(
  persist(
    set => ({
      token: '',
      email: '',
      userName: '',
      userId: '',
      getUserToken: value =>
        set(() => ({
          token: value,
        })),
      getUserIdStore: value =>
        set(() => ({
          userId: value,
        })),
      getEmailStore: value =>
        set(() => ({
          email: value,
        })),
      getUserNameStore: value =>
        set(() => ({
          userName: value,
        })),
    }),
    //! Esto se esta guardando en la sessionStorage (para la persistencia) <- Por ahora
    {
      name: 'user-storage',
      getStorage: () => sessionStorage,
    },
  ),
)
