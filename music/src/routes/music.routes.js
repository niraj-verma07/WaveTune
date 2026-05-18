import express from "express";
import multer from "multer";
import * as musicController from "../controllers/music.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

const router = express.Router();

/** GET /api/music */

router.get(
  "/",
  authMiddleware.authUserMiddleware,
  musicController.getAllMusicController,
);

/** POST /api/music/upload */
router.post(
  "/upload",
  authMiddleware.authArtistMiddleware,
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  musicController.uploadSongController,
);

/** GET /api/music/artist-musics */
router.get(
  "/artist-musics",
  authMiddleware.authArtistMiddleware,
  musicController.getArtistMusicController,
);

/** POST /api/music/playlist */
router.post(
  "/playlist",
  authMiddleware.authArtistMiddleware,
  musicController.createPlaylistController,
);

/** GET /api/music/playlist */
router.get(
  "/playlist",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylistsController,
);

/**GET /api/music/playlist/artist */
router.get(
  "/playlist/artist",
  authMiddleware.authArtistMiddleware,
  musicController.getArtistPlaylistsController,
);

/** GET /api/music/playlist/:id */
router.get(
  "/playlist/:id",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylistByIdController,
);

/**GET /api/music/get-details/:id */
router.get(
  "/get-details/:id",
  authMiddleware.authUserMiddleware,
  musicController.getMusicByIdController,
);

export default router;
