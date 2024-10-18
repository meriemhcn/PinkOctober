const express=require("express");
const router=express.Router();
const userModel=require("../dataBase/modles/users.js");
const jwt=require("../util/jwt.js");
const hashUtile=require("../util/hash.js");
const PostModel=require("../dataBase/modles/post.js");
const PostModel2=require("../dataBase/modles/post2.js");
const CentreModel=require("../dataBase/modles/Centre.js");
const DictioModel=require("../dataBase/modles/Dictionnaire.js");
const authenticate = require("../middleware/authM.js");

router.post("/signup",async function(req,res){
const pseudo=req.body.pseudo;
const email=req.body.email;
const password=req.body.password;
const firstname=req.body.firstname;
const lastname=req.body.lastname;


if(!email || !password || !firstname || !lastname || !pseudo){
    res.json("Invalid body !! email or name or password or pseudo not intred");
    return;
}
try{
const hashedPassword=await hashUtile.hashPassword(password);
await userModel.create({pseudo:pseudo,email:email,firstName:firstname,lastName:lastname,password: hashedPassword});

res.json("user created succesfuly");
}
catch(error){
console.log(error);    
res.json("an error has been detected");
}

});


router.post("/login",async function(req,res){
const pseudo=req.body.pseudo;
const password=req.body.password;


const user = await userModel.findOne({pseudo:pseudo});
if(!user){res.json("user not found");
    return;
}

const isValid=await hashUtile.comparePassword(user.password,password);
if(!isValid){
    res.json("password incorrect");
    return;
    
}
const token=jwt.genertatoken(user._id);
res.json({token});


});

router.post("/create/post",async function(req,res){

const posterid=req.body.posterid;
const message=req.body.message;


    if(!posterid || !message){
        res.status(401).json("Invalid body !! ");
        return;
    }

    try{
 
        const user = await userModel.findOne({ _id: posterid});
        if(!user){res.status(401).json("user not found");
            return;
        }

        const token=jwt.genertatoken(user._id);

        await PostModel.create({
        posterId:posterid,message:message
          });
    
    res.json(" Vous avez bien poster un message");
    }
    catch(error){
    console.log(error);    
    res.json("an error has been detected");
    }
    
    }
);
router.put("/update/profile", async function(req, res) {
    const pseudo=req.body.pseudo;
    const email=req.body.email;
    const password=req.body.password;
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const bio=req.body.bio;
    try {
        const user = await userModel.findOne({pseudo:pseudo});
        if(!user){res.status(401).json("user not found");
            return;
        }
        
        const isValid=await hashUtile.comparePassword(user.password,password);
        if(!isValid){
            res.status(401).json("password incorrect");
            return;
            
        }

        const token=jwt.genertatoken(user._id);

        if (pseudo) user.pseudo = pseudo;
        if (email) user.email = email;
        if (firstname) user.firstName= firstname;
        if (lastname) user.lastName = lastname;
        if (bio) user.bio = bio;

        // Attendre que la promesse de sauvegarde soit résolue
        await user.save();

        res.json(" Profile saved");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/desabonner/:pseudo", async function(req, res) {
    try {
        
      const pseudou = req.body.pseudo
      const  utilisateurConnecte= await userModel.findOne({pseudo:pseudou});
      if (!utilisateurConnecte) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }
  
      const pseudoADesabonner = req.params.pseudo;
  
      // Vérifier si l'utilisateur est déjà dans la liste des abonnements
      if (!utilisateurConnecte.following.includes(pseudoADesabonner)) {
        return res.status(400).json({ message: "Vous n'êtes pas abonné à cet utilisateur" });
      }
  
      // Mettre à jour l'utilisateur connecté en retirant le pseudo du tableau following
      const utilisateurMisAJour = await userModel.findByIdAndUpdate(
        utilisateurConnecte._id,
        { $pull: { following: pseudoADesabonner } },
        { new: true, runValidators: true }
      );
  
      if (!utilisateurMisAJour) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // Mettre à jour l'utilisateur dont on se désabonne en retirant l'utilisateur connecté de ses followers
      await userModel.findOneAndUpdate(
        { pseudo: pseudoADesabonner },
        { $pull: { followers: utilisateurConnecte._id } }
      );
  
      res.status(200).json({
        message: `Vous vous êtes désabonné de ${pseudoADesabonner}`,
        utilisateur: utilisateurMisAJour
      });
    } catch (error) {
      console.error("Erreur lors du désabonnement :", error);
      res.status(500).json({ message: "Erreur serveur lors du désabonnement" });
    }
  });

  router.put("/abonner/:pseudo", async function(req, res) {
    try {

        const pseudou = req.body.pseudo
        const  utilisateurConnecte= await userModel.findOne({pseudo:pseudou});
  
      if (!utilisateurConnecte) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
  
      const pseudoAAbonner = req.params.pseudo;
  
      // Vérifier si l'utilisateur n'est pas déjà dans la liste des abonnements
      if (utilisateurConnecte.following.includes(pseudoAAbonner)) {
        return res.status(400).json({ message: "Vous êtes déjà abonné à cet utilisateur" });
      }
  
      // Vérifier si l'utilisateur à abonner existe
      const utilisateurAAbonner = await userModel.findOne({ pseudo: pseudoAAbonner });
      if (!utilisateurAAbonner) {
        return res.status(404).json({ message: "L'utilisateur à suivre n'existe pas" });
      }
  
      // Mettre à jour l'utilisateur connecté en ajoutant le pseudo à la liste following
      const utilisateurMisAJour = await userModel.findByIdAndUpdate(
        utilisateurConnecte._id,
        { $addToSet: { following: pseudoAAbonner } },
        { new: true, runValidators: true }
      );
  
      // Mettre à jour l'utilisateur suivi en ajoutant l'ID de l'utilisateur connecté à ses followers
      await userModel.findByIdAndUpdate(
        utilisateurAAbonner._id,
        { $addToSet: { followers: utilisateurConnecte._id } }
      );
  
      res.status(200).json({
        message: `Vous vous êtes abonné à ${pseudoAAbonner}`,
        utilisateur: utilisateurMisAJour
      });
    } catch (error) {
      console.error("Erreur lors de l'abonnement :", error);
      res.status(500).json({ message: "Erreur serveur lors de l'abonnement" });
    }
  });



  router.get("/utilisateurs", async function(req, res) {
    try {
     
      const utilisateurs = await userModel.find({})
        .select('-password') 
        .sort({ createdAt: -1 });  
     
      if (utilisateurs.length === 0) {
        return res.status(404).json({ message: "Aucun utilisateur trouvé dans la base de données" });
      }
  
     
      res.status(200).json(utilisateurs);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs" });
    }
  });

  router.put("/change/password", async function(req, res) {
    const pseudo=req.body.pseudo;
    const ancienpassword=req.body.ancienpassword;
    const newpassword=req.body.newpassword;

    try {
        const user = await userModel.findOne({pseudo:pseudo});
        if(!user){res.status(401).json("user not found");
            return;
        }
        
        const isValid=await hashUtile.comparePassword(user.password,ancienpassword);
        if(!isValid){
            res.status(401).json("password incorrect");
            return;
            
        }

        const token=jwt.genertatoken(user._id);
        const hashedPassword=await hashUtile.hashPassword(newpassword);
        user.password=hashedPassword

        // Attendre que la promesse de sauvegarde soit résolue
        await user.save();

        res.json(" Profile saved");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
} );

router.put('/like-post1/:id', async (req, res) => {

    if (!req.body.userId)
      return res.status(400).json({ message: "ID d'utilisateur non fourni" });
  
    try {
      const postId = req.params.id;
      const userId = req.body.userId;
  
      const post = await PostModel.findById(postId);
      if (!post) return res.status(404).json({ message: "Post non trouvé" });
  
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      if (post.likers.includes(userId)) {
        // Unlike the post
        await PostModel.findByIdAndUpdate(postId, {
          $pull: { likers: userId }
        });
        await userModel.findByIdAndUpdate(userId, {
          $pull: { likes: postId }
        });
        res.status(200).json({ message: "Post unliké avec succès" });
      } else {
        // Like the post
        await PostModel.findByIdAndUpdate(postId, {
          $addToSet: { likers: userId }
        });
        await userModel.findByIdAndUpdate(userId, {
          $addToSet: { likes: postId }
        });
        res.status(200).json({ message: "Post liké avec succès" });
      }
    } catch (error) {
      console.error("Erreur lors du like/unlike :", error);
      res.status(500).json({ message: "Erreur serveur lors du like/unlike" });
    }
  });
  
  router.put('/remove-like1/:id', async (req, res) => {
    if (!req.body.userId)
      return res.status(400).json({ message: "ID d'utilisateur non fourni" });
  
    try {
      const postId = req.params.id;
      const userId = req.body.userId;
  
      const post = await PostModel.findById(postId);
      if (!post) return res.status(404).json({ message: "Post non trouvé" });
  
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      if (post.likers.includes(userId)) {
        // Retirer le like
        await PostModel.findByIdAndUpdate(postId, {
          $pull: { likers: userId }
        });
        await userModel.findByIdAndUpdate(userId, {
          $pull: { likes: postId }
        });
        res.status(200).json({ message: "Like retiré avec succès" });
      } else {
        // L'utilisateur n'a pas liké ce post
        res.status(400).json({ message: "L'utilisateur n'a pas liké ce post" });
      }
    } catch (error) {
      console.error("Erreur lors du retrait du like :", error);
      res.status(500).json({ message: "Erreur serveur lors du retrait du like" });
    }
  });
  

  router.post('/comment-post1/:id', async (req, res) => {
    if (!req.body.commenterId || !req.body.text)
      return res.status(400).json({ message: "Données de commentaire incomplètes" });
  
    try {
      const postId = req.params.id;
      const { commenterId, text } = req.body;
  
      const post = await PostModel.findById(postId);
      if (!post) return res.status(404).json({ message: "Post non trouvé" });
  
      const user = await userModel.findById(commenterId);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      const newComment = {
        commenterId: commenterId,
        commenterPseudo: user.pseudo,
        text: text,
        timestamp: new Date().getTime()
      };
  
      await PostModel.findByIdAndUpdate(
        postId,
        { $push: { comments: newComment } },
        { new: true, runValidators: true }
      );
  
      res.status(201).json({ message: "Commentaire ajouté avec succès", comment: newComment });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      res.status(500).json({ message: "Erreur serveur lors de l'ajout du commentaire" });
    }
  });

  router.post("/create/post2",async function(req,res){

    const posterid=req.body.posterid;
    const message=req.body.message;
    const url=req.body.url;
    
    
        if(!posterid || !message){
            res.status(401).json("Invalid body !! ");
            return;
        }
    
        try{
     
            const user = await userModel.findOne({ _id: posterid});
            if(!user){res.status(401).json("user not found");
                return;
            }
    
            const token=jwt.genertatoken(user._id);
    
            await PostModel2.create({
            posterId:posterid,message:message,linkUrl:url
              });
        
        res.json(" Vous avez bien poster une nouvelle");
        }
        catch(error){
        console.log(error);    
        res.json("an error has been detected");
        }
        
        }
    );
  
    router.put('/like-post2/:id', async (req, res) => {

        if (!req.body.userId)
          return res.status(400).json({ message: "ID d'utilisateur non fourni" });
      
        try {
          const postId = req.params.id;
          const userId = req.body.userId;
      
          const post = await PostModel2.findById(postId);
          if (!post) return res.status(404).json({ message: "Post non trouvé" });
      
          const user = await userModel.findById(userId);
          if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
      
          if (post.likers.includes(userId)) {
            // Unlike the post
            await PostModel2.findByIdAndUpdate(postId, {
              $pull: { likers: userId }
            });
            await userModel.findByIdAndUpdate(userId, {
              $pull: { likes: postId }
            });
            res.status(200).json({ message: "Post unliké avec succès" });
          } else {
            // Like the post
            await PostModel2.findByIdAndUpdate(postId, {
              $addToSet: { likers: userId }
            });
            await userModel.findByIdAndUpdate(userId, {
              $addToSet: { likes: postId }
            });
            res.status(200).json({ message: "Post liké avec succès" });
          }
        } catch (error) {
          console.error("Erreur lors du like/unlike :", error);
          res.status(500).json({ message: "Erreur serveur lors du like/unlike" });
        }
      });



      router.put('/remove-like2/:id', async (req, res) => {
        if (!req.body.userId)
          return res.status(400).json({ message: "ID d'utilisateur non fourni" });
      
        try {
          const postId = req.params.id;
          const userId = req.body.userId;
      
          const post = await PostModel2.findById(postId);
          if (!post) return res.status(404).json({ message: "Post non trouvé" });
      
          const user = await userModel.findById(userId);
          if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
      
          if (post.likers.includes(userId)) {
            // Retirer le like
            await PostModel2.findByIdAndUpdate(postId, {
              $pull: { likers: userId }
            });
            await userModel.findByIdAndUpdate(userId, {
              $pull: { likes: postId }
            });
            res.status(200).json({ message: "Like retiré avec succès" });
          } else {
            // L'utilisateur n'a pas liké ce post
            res.status(400).json({ message: "L'utilisateur n'a pas liké ce post" });
          }
        } catch (error) {
          console.error("Erreur lors du retrait du like :", error);
          res.status(500).json({ message: "Erreur serveur lors du retrait du like" });
        }
      });

      router.post('/comment-post2/:id', async (req, res) => {
        if (!req.body.commenterId || !req.body.text)
          return res.status(400).json({ message: "Données de commentaire incomplètes" });
      
        try {
          const postId = req.params.id;
          const { commenterId, text } = req.body;
      
          const post = await PostModel2.findById(postId);
          if (!post) return res.status(404).json({ message: "Post non trouvé" });
      
          const user = await userModel.findById(commenterId);
          if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
      
          const newComment = {
            commenterId: commenterId,
            commenterPseudo: user.pseudo,
            text: text,
            timestamp: new Date().getTime()
          };
      
          await PostModel2.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment } },
            { new: true, runValidators: true }
          );
      
          res.status(201).json({ message: "Commentaire ajouté avec succès", comment: newComment });
        } catch (error) {
          console.error("Erreur lors de l'ajout du commentaire :", error);
          res.status(500).json({ message: "Erreur serveur lors de l'ajout du commentaire" });
        }
      });

      


 


module.exports=router;