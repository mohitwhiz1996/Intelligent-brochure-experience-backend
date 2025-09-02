const { sendSuccess, sendError } = require("../utils/responseHandler");
const {
  analyzeImagesWithAI,
  analyzeAllImagesTogether,
  finalizeBrochureContent,
} = require("../services/aiService");
const Brochure = require("../models/brochure")
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

async function createBrosure(req, res) {
  try {
    const { title, description, imageUrls } = req.body;

    const validUrls = imageUrls.filter((url) => {
      try {
        new URL(url);
        return true; // Accept any valid URL
      } catch {
        return false;
      }
    });

    //Step 1: Analyze images with AI
    const aiDescriptions = await analyzeImagesWithAI(validUrls);

    // Step 2: Enhance title and description
    const enhancedContent = await analyzeAllImagesTogether(title, description);

    // Step 3: Final optimization - combine everything for best brochure layout
     const finalContent = await finalizeBrochureContent(enhancedContent, aiDescriptions);
    finalContent.imageLayout[0].description = finalContent.finalDescription
    let result = await Brochure.create({
        userId: req.userId,
        title, description, imageURLs: validUrls, aiResponse: finalContent
    })
    sendSuccess(res, { finalContent, id: result._id});
  } catch (err) {
    sendError(res);
  }
}

async function getBrosure(req, res) {
  try {
    let brochureData= await Brochure.find({
        userId: new ObjectId(req.userId)
    })
    sendSuccess(res, { brochureData });
  } catch (err) {
    console.log(err)
    sendError(res);
  }
}

async function deleteBrosure(req, res) {
  try {
    let brochureData= await Brochure.findOneAndDelete(req.params.id)
    sendSuccess(res);
  } catch (err) {
    console.log(err)
    sendError(res);
  }
}

module.exports = {
  createBrosure,
  getBrosure,
  deleteBrosure
};
