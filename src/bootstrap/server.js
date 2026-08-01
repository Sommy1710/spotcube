import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import logger from '../app/middleware/logger.middleware.js';
import { NotFoundError } from '../lib/error-definitions.js';
import errorMiddleware from '../app/middleware/error-middleware.js';
import config from '../config/app.config.js'
import { getSecondsFromNow } from '../lib/util.js';
import express from 'express';
import {createServer} from 'http';
import {authRouter} from '../modules/auth/api.js';
import { spotOwnerRouter } from '../modules/spotOwner/spotOwner.routes.js';
import {spotPostRouter} from '../modules/spotPost/spotPost.routes.js';
import {favouritesRouter} from '../modules/favourites/favourites.routes.js';
import { spotPostCommentRouter } from '../modules/spotPostComment/spotPostComment.routes.js';
import {spotCommentLikeRouter} from '../modules/spotPostCommentLike/spotPostCommentLike.routes.js';
import {spotCommentReplyRouter} from '../modules/spotcommentReply/spotCommentReply.routes.js';
import cookieParser  from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/swagger.js';
import * as Sentry from '@sentry/node';
import {Server} from 'socket.io';




const app = express();
const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger());
app.use(
    cookieParser({
        httpOnly: true,
        secure: config.environment === 'production',
        sameSite: 'strict',
        maxAge: getSecondsFromNow(config.jwt.expiration)
    })
)

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'server is running'
    });
})

//app.use('/api/email', emailRoutes);
app.use('/api/auth', authRouter);
app.use('/api/spotOwner', spotOwnerRouter);
app.use('/api/spotPost', spotPostRouter);
app.use('/api/favourites', favouritesRouter);
app.use('/api/spotPostComment', spotPostCommentRouter);
app.use('/api/spotPostCommentLike', spotCommentLikeRouter);
app.use('/api/spotCommentReply', spotCommentReplyRouter);
// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//app.use(Sentry.middleware.error);
app.use(
  express.json({
    strict: true,
    verify: (req, res, buf) => {
      if (!buf.length) {
        req.body = {};
      }
    },
  })
);


app.use((req, res, next) => {
    next(new NotFoundError(`the requested route ${req.originalUrl} does not exist on this server`));
});

// socket.IO logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", ({senderId, receiverId, message}) => {
        io.to(receiverId).emit("receiveMessage", {senderId, message});
    });

    socket.on("join", (userId) => {
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
    });
});

app.use((req, res, next) => {
    next(new NotFoundError(`the requested route ${req.originalUrl} does  not exist on this server`));
});
app.use(errorMiddleware);

export {app, server};