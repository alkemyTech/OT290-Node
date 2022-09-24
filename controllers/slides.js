const { Slides } = require("../models");
const { Buffer } = require("node:buffer");
const base64 = require("base-64");

const { uploadFileS3 } = require("../services/S3storage");

const getSlides = async (req, res) => {
  await Slides.findAll()
    .then((items) => {
      return res.status(200).json(items);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

const getSlide = async (req, res) => {
  const { id } = req.params;
  await Slides.findByPk(id)
    .then((items) => {
      return res.status(200).json(items);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

const createSlide = async (req, res) => {
  try {
    const { image, text, organization_id } = req.body;
    let { order } = req.body;
    // BITMAP THE IMAGEN
    let bitmap = Buffer.from(base64.decode(image)); // .toString('base64');
    let imageUrl = await uploadFileS3(bitmap, "imagen.png");
    if (!order) {
      order = await Slides.count({
        where: {
          organizationId: organization_id,
        },
      });
      order++;
    }
    const newSlide = await Slides.create({
      imageUrl,
      text,
      order,
      organizationId: organization_id,
    });
    newSlide.save();
    return res.status(201).json(newSlide);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, text, order, organization_id } = req.body;
    const slideFound = await Slides.findByPk(id);
    if (!slideFound) {
      return res.status(404).send({ message: "Slide inexistente" });
    }
    await Slides.update(
      { imageUrl, text, order, organization_id },
      {
        where: {
          id: id,
        },
      }
    );
    return res.status(204).json(slideFound);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slideFound = await Slides.findByPk(id);
    if (!slideFound) {
      return res.status(404).send({ message: "Slide Inexistente" });
    }
    await Slides.destroy({
      where: {
        id: id,
      },
    });
    return res.status(204).json(slideFound);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getSlides,
  getSlide,
  createSlide,
  updateSlide,
  deleteSlide,
};
