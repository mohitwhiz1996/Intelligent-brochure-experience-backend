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

    // Step 1: Analyze images with AI
    const aiDescriptions = await analyzeImagesWithAI(validUrls);

    // Step 2: Enhance title and description
    const enhancedContent = await analyzeAllImagesTogether(title, description);

    // Step 3: Final optimization - combine everything for best brochure layout
    const finalContent = await finalizeBrochureContent(enhancedContent, aiDescriptions);

    // const finalContent = {
    //   finalTitle: "Your Coastal Oasis: A Stylish 1-Bedroom Apartment Awaits",
    //   finalDescription:
    //     "Escape to refined urban living in this exquisite 1-bedroom apartment.  The spacious layout seamlessly blends comfort and modern style, perfect for relaxation and entertaining.  A well-appointed kitchen, a serene bedroom, and access to [mention building amenities if any, e.g., a state-of-the-art fitness center, sparkling swimming pool, or beautifully landscaped gardens] complete this idyllic haven.  Imagine waking up to the calming ambiance of [mention nearby attractions if applicable, e.g., the ocean breeze, city skyline views]. This exceptional opportunity awaits. Contact us today to schedule a viewing!",
    //   imageLayout: [
    //     {
    //       imageUrl:
    //         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb71NqMhNQPcM-8xR6JeSvnh4OGBRTuioGdg&s",
    //       imageNumber: 1,
    //       description:
    //         "Serene coastal landscape, painted in Impressionistic style, evokes tranquility with vibrant hues and soft brushstrokes.",
    //       suggestedPosition: 1,
    //       reasoning: "Default positioning",
    //     },
    //   ],
    // };
    await Brochure.create({
        userId: req.userId,
        title, description, imageURLs: validUrls, aiResponse: finalContent
    })
    sendSuccess(res, { finalContent });
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
