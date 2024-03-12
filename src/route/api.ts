import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {NoteController} from "../controller/note-controller";
import {TagController} from "../controller/tag-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

apiRouter.get('/api/users/current', UserController.get);
apiRouter.patch('/api/users/current', UserController.update);
apiRouter.delete('/api/users/logout', UserController.logout);

apiRouter.post("/api/notes", NoteController.create);
apiRouter.get("/api/notes/:noteId", NoteController.get);
apiRouter.patch("/api/notes/:noteId", NoteController.update);
apiRouter.delete("/api/notes/:noteId", NoteController.remove);

apiRouter.post("/api/tags", TagController.create);
apiRouter.patch("/api/tags/:tagId", TagController.update);