export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],

    // ─── Juegos ───
    games: [],

    // AGREGADO para auth (Login / Signup / Profile) ───
    user: null, // datos del usuario: { id, username, email }
    token: null, // JWT para autenticar peticiones
    isAuthenticated: false, // true si hay sesión activa
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };

    //auth

    //Después del login exitoso:  guarda user + token en el store
    case "set_auth":
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "logout":
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return {
        ...store,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case "restore_auth":
      const token = sessionStorage.getItem("token");
      let user = null;
      try {
        const raw = sessionStorage.getItem("user");
        user = raw ? JSON.parse(raw) : null;
      } catch {
        // si el JSON está corrupto (ej: guardaron "undefined" como string),
        // no rompemos la app — tratamos como si no hubiera sesión
        user = null;
      }
      return {
        ...store,
        user,
        token,
        isAuthenticated: !!token && !!user,
      };

    // ─── Juegos ───
    case "set_games":
      return {
        ...store,
        games: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
