import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

// ! create specialty
const createSpecialtyController = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await SpecialtyService.createSpecialty(payload);

    res.status(200).json({
      success: true,
      message: "Specialty created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create specialty",
      error: error,
    });
  }
};

// ! get all specialties
const getAllSpecialtiesController = async (req: Request, res: Response) => {
  try {
    const result = await SpecialtyService.getAllSpecialties();

    res.status(200).json({
      success: true,
      message: "Specialties fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch specialties",
      error: error,
    });
  }
};

// ! get specialty by id
const getSpecialtyByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SpecialtyService.getSpecialtyById(id as string);

    res.status(200).json({
      success: true,
      message: "Specialty fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch specialty",
      error: error,
    });
  }
};

// ! update specialty
const updateSpecialtyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await SpecialtyService.updateSpecialty(
      id as string,
      payload,
    );

    res.status(200).json({
      success: true,
      message: "Specialty updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update specialty",
      error: error,
    });
  }
};

// ! delete specialty
const deleteSpecialtyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await SpecialtyService.deleteSpecialty(id as string);

    res.status(200).json({
      success: true,
      message: "Specialty deleted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete specialty",
      error: error,
    });
  }
};

export const SpecialtyController = {
  createSpecialtyController,
  getAllSpecialtiesController,
  getSpecialtyByIdController,
  updateSpecialtyController,
  deleteSpecialtyController,
};
