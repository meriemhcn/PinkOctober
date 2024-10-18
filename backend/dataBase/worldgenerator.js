const mongoose = require('mongoose');
const Dictionary = require('./modles/Dictionnaire.js'); 
require('dotenv').config();
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });


const words = [
  { word: "Mammogram", definition: "An X-ray of the breast used to screen for or detect breast cancer." },
  { word: "Biopsy", definition: "A procedure that involves removing a small sample of breast tissue for laboratory testing to confirm a cancer diagnosis." },
  { word: "Lobular carcinoma", definition: "A type of breast cancer that starts in the milk-producing glands (lobules)" },
  { word: "Ductal carcinoma", definition: "A type of breast cancer that begins in the ducts that carry milk to the nipple." },
  { word: "Estrogen receptor (ER)", definition: "A protein in breast cancer cells that can promote cancer growth if estrogen is present." },
  { word: "HER2-positive", definition: " A breast cancer type where cancer cells have high levels of HER2 protein, often leading to faster growth." },
  { word: "BRCA1/BRCA2", definition: " Genes; mutations in these genes can significantly increase the risk of breast and ovarian cancers." },
  { word: "Mastectomy", definition: "Surgical removal of one or both breasts, partially or completely, as a treatment for breast cancer." },
  { word: "Lumpectomy", definition: "A surgery to remove the tumor and a small amount of surrounding tissue from the breast." },
  { word: "Sentinel lymph node biopsy", definition: "A procedure used to determine if cancer has spread to the lymph nodes." },
  { word: "Chemotherapy", definition: "A treatment using drugs to kill cancer cells, often used to treat breast cancer." },
  { word: "Radiation therapy", definition: "A treatment involving high-energy rays to destroy cancer cells in the breast after surgery." },
  { word: "Hormone therapy", definition: "A treatment for breast cancer that targets hormone receptors, such as tamoxifen for ER-positive cancers." },
  { word: "Triple-negative breast cancer", definition: "A type of breast cancer that does not have receptors for estrogen, progesterone, or HER2, making it more difficult to treat." },
  { word: "Oncotype DX ", definition: "A genomic test that helps assess the risk of breast cancer recurrence and guides treatment decisions." },
  { word: "Paget’s disease of the breast ", definition: "A rare form of breast cancer that affects the skin of the nipple and areola." },
  { word: "Invasive breast cancer ", definition: "Cancer that has spread from where it started in the breast ducts or lobules into surrounding tissue." },
  { word: "Metastasis", definition: "The spread of cancer cells from the breast to other parts of the body, such as bones or liver." },
  { word: "Prophylactic mastectomy", definition: "Preventive surgery to remove the breasts in women at high risk for breast cancer (e.g., BRCA mutation carriers)." },
  { word: "Tamoxifen", definition: "A drug used in hormone therapy to block estrogen, often prescribed for ER-positive breast cancer." }
];


const insertWords = async () => {
  try {
    await Dictionary.insertMany(words);  
    console.log("Mots insérés avec succès !");
    mongoose.connection.close(); 
  } catch (error) {
    console.error("Erreur lors de l'insertion des mots :", error);
  }
};

insertWords();

module.exports=insertWords();
