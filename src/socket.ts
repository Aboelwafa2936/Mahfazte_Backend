import { Server } from "socket.io";

let io: Server;

export const initSocket = (serverIO: Server) => {
  io = serverIO;

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // 📌 استلام userId من الفرونت والانضمام لرومه
    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`📌 User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
