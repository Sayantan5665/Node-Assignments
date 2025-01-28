import multer, { StorageEngine, diskStorage, Multer } from "multer";
import { existsSync, mkdirSync, unlink } from "fs";
import path, { extname } from "path";
import { Request } from "express";

// Checking if the uploads folder exists or no, if not then create one
const uploadDir: string = './uploads';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

const storage: StorageEngine = diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext: string = extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'image/svg+xml') {
    cb(null, true)
  } else {
    cb(new Error('Only images are allowed!'));
  }
}

export const upload: Multer = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // limit 10MB
  fileFilter: fileFilter
});

export const deleteUploadedFile = (existingImageName: string, defaultImageName:string) => {
  if (existingImageName && existingImageName !== defaultImageName) {
    unlink(path.join(__dirname, '..', '..', 'uploads', existingImageName), (err) => {
      if (err) console.error(`Error deleting image: ${err}`);
      else {
        console.log('Old images deleted successfully');
      }
    });
  }
}