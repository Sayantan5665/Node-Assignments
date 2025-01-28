import { Request, Response } from "express";
import labelRepo from "../../repositories/label.repositories";
import { ILabel } from "@interfaces";

class labelController {
    /*** (Admin only) */
    async createLabel(req: Request, res: Response): Promise<any> {
        try {
            const body = req.body;

            const existingLabel: ILabel | null = await labelRepo.fetchLabelByTitle(body.title);
            if (existingLabel) {
                return res.status(400).json({
                    status: 400,
                    message: 'This label already exists!',
                });
            }

            const newLabel: ILabel = await labelRepo.addLabel(body);
            res.status(200).json({
                status: 200,
                message: 'Label created successfully!',
                data: newLabel,
            });
        } catch (error: any) {
            console.error("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            });
        }
    }

    /*** (Everyone) */
    async getLabel(req: Request, res: Response): Promise<any> {
        try {
            const label: Array<ILabel> = await labelRepo.fetchLabels();

            res.status(200).json({
                status: 200,
                message: 'Labels fetched successfully!',
                data: label,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (Admin only) */
    async updateLabel(req: Request, res: Response): Promise<any> {
        try {
            const body = req.body;
            const labelId = req.params.id;

            const _label: ILabel | null = await labelRepo.fetchLabelById(labelId);
            if (!_label) {
                return res.status(404).json({
                    status: 404,
                    message: 'label not found!',
                });
            }
            body.isActive = _label.isActive;

            const updatedLabel: ILabel | null = await labelRepo.updateLabel(labelId, body);

            if (!updatedLabel) {
                return res.status(404).json({
                    status: 404,
                    message: 'Label not found!',
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Label updated successfully!',
                data: updatedLabel,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (Admin only) */
    async deleteLabel(req: Request, res: Response): Promise<any> {
        try {
            const labelId = req.params.id;

            const existingLabel = await labelRepo.fetchLabelById(labelId);
            if (!existingLabel) {
                return res.status(404).json({
                    status: 404,
                    message: 'Label not found!',
                });
            }

            const label = await labelRepo.deleteLabel(labelId);
            if (!label) {
                return res.status(400).json({
                    status: 400,
                    message: 'Some error occured',
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Label deleted successfully!'
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

}

export default new labelController();