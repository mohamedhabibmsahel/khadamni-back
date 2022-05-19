const User = require('../models/user.model.js');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
var cloudinary = require('../middleware/cloudinary')
const saltRounds = 10;
const Token = require('../models/Token');
const picsPath = require("path").resolve(__dirname, "../upload");

// Create and Save a new Note

//router.post ('/',multer,async (req,res) => {
    exports.create = async(req, res) => {
    await User.init();
    const hashedPass = await bcrypt.hash(req.body.password,10)
    console.log(req.body)
    if (req.file != null) {
        const photoCloudinary = await cloudinary.uploader.upload(req.file.path)
        //const photoCloudinary = await cloudinary.uploader.upload(req.file.filename)
        req.body.urlImg = photoCloudinary.url
      } else {
        req.body.urlImg  = "https://res.cloudinary.com/dy05x9auh/image/upload/v1648226974/athlete_lxnnu3.png"
      }
    const user = new User({
        ...req.body,
                password :hashedPass,              
    })
    try {
        const newUser = await user.save()
        const tokenJWT = jwt.sign({username: req.body.email}, "SECRET")
        var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: "m'sahel.mohamedhabib@esprit.tn",
              pass: process.env.EMAIL_MDP
            }
          });
          var mailOptions = {
            from: "m'sahel.mohamedhabib@esprit.tn",
            to: req.body.email,
            subject:'Welcome To KHADAMNI',
           /* text: 'You receive this email from Khadamni application bellow you will find a link please click on it\n\n' +
                'The code is  :' + token.token + '\n\n' +
                'http:\/\/' + req.headers.host + '\/users\/resetPassword\/' + res.user.email + '\/' + token.token
                + '\n\n Si vous n\'avez pas fait cette requete, veuillez ignorer ce message et votre mot de passe sera le méme.\n'*/
                html:  '<div class="es-wrapper-color">'+
                '<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">'+
                //HEADER
                '<tbody>'+
                    '<tr>'+
                '<td class="esd-structure es-p20t es-p20b es-p20r es-p20l" style="background-color: #3d5ca3;" bgcolor="#3d5ca3" align="left">'+
                '<table class="es-left" cellspacing="0" cellpadding="0" align="center">'+
                '<tbody>'+
                    '<tr>'+
                    '<td class="es-m-p20b esd-container-frame" width="270" align="left">'+
                        '<table width="100%" cellspacing="0" cellpadding="0">'+
                            '<tbody>'+
                                '<tr>'+
                                    '<td class="esd-block-image es-m-p0l es-m-txt-c" align="center" style="font-size: 0px;padding: 20px">'+
                                        '<a href="https://www.facebook.com/Khadamni-100921899214016/" target="_blank"><img src="https://fv9-6.failiem.lv/thumb_show.php?i=26a9n6fcj&view" alt style="display: block; border-radius: 8px;" width="183"></a>'+
                                    '</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</td>'+
               ' </tr>'+
            '</tbody>'+
        '</table>'+
    '</td>'+
                //container 
                '<tbody>'+
                    '<tr>'+
                '<td class="esd-structure es-p40t es-p20r es-p20l" style="background-color: transparent;" bgcolor="transparent" align="left">'+
                '<table width="100%" cellspacing="0" cellpadding="0">'+
                    '<tbody>'+
                        '<tr>'+
                            '<td class="esd-container-frame" width="560" valign="top" align="center">'+
                                '<table style="background-position: left top;" width="100%" cellspacing="0" cellpadding="0">'+
                                   '<tbody>'+
                                        '<tr>'+
                                            '<td align="center" style="font-size:0; ">'+
                                                '<a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_9cca54ddac8a1c025f5b3dfe3803ecaa/images/72091609237168348.png" alt style="display: block;max-width: 100%;height: auto;" ></a>'+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td class="esd-block-text es-p15t es-p15b" align="center">'+
                                                '<h1 style="color: #333333; font-size: 20px;"><strong>We are glad you were registered! </strong></h1>'+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td class="esd-block-text es-p40r es-p40l" align="center">'+
                                            '<p>HI,'+req.body.nom+' '+req.body.prenom+'</p>'+
                                            '</td>'+
                                        '</tr>'+
                                       '<tr>'+
                                            '<td class="esd-block-text es-p35r es-p40l" align="left">'+
                                                '<p style="text-align: center;">Welcome to our family!Thank you for joining Us</p>'+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td class="esd-block-text es-p25t es-p40r es-p40l" align="center">'+
                                                '<p>Don\'t worry Khadamni will help you so much in your life</p>'+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td class="esd-block-text es-p25t es-p40r es-p40l" align="center">'+
                                                '<p>Have a nice day</p>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>'+
                           '</td>'+
                        '</tr>'+
                    '</tbody>'+
                '</table>'+
            '</td>'+
            //follow us
            '<tbody>'+
            '<tr>'+
            '<td class="esd-structure es-p20t es-p10r es-p10l" align="left">'+
        '<table class="es-left" cellspacing="0" cellpadding="0" align="left">'+
            '<tbody>'+
                '<tr>'+
                    '<td class="esd-container-frame" width="199" align="left">'+
                        '<table style="background-position: center center;" width="100%" cellspacing="0" cellpadding="0">'+
                            '<tbody>'+
                                '<tr>'+
                                    '<td class="esd-block-text es-p15t es-m-txt-c" align="right">'+
                                        '<p style="font-size: 16px; color: #666666;"><strong>Follow us:</strong></p>'+
                                    '</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</td>'+
                '</tr>'+
            '</tbody>'+
        '</table>'+
        '<table class="es-right" cellspacing="0" cellpadding="0" align="right">'+
            '<tbody>'+
                '<tr>'+
                    '<td class="esd-container-frame" width="361" align="left">'+
                        '<table style="background-position: center center;" width="100%" cellspacing="0" cellpadding="0">'+
                            '<tbody>'+
                                '<tr>'+
                                    '<td class="esd-block-social es-p10t es-p5b es-m-txt-c" align="left" style="font-size:0">'+
                                        '<table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0">'+
                                            '<tbody>'+
                                                '<tr>'+
                                                '<td class="es-p10r" valign="top" align="center">'+
                                                '<a target="_blank" href="https://www.facebook.com/Khadamni-100921899214016/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/facebook-rounded-gray.png" alt="Fb" title="Facebook" width="32"></a>'+
                                            '</td>'+
                                            '<td class="es-p10r" valign="top" align="center">'+
                                                '<a target="_blank" href="https://www.facebook.com/Khadamni-100921899214016/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/twitter-rounded-gray.png" alt="Tw" title="Twitter" width="32"></a>'+
                                            '</td>'+
                                            '<td class="es-p10r" valign="top" align="center">'+
                                                '<a target="_blank" href="https://www.instagram.com/mohamedhbib.msahel/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png" alt="Ig" title="Instagram" width="32"></a>'+
                                            '</td>'+
                                            '<td class="es-p10r" valign="top" align="center">'+
                                                '<a target="_blank" href="https://www.youtube.com/channel/UCgq2WxpWzdiu9pAaNB8Q3dw"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/youtube-rounded-gray.png" alt="Yt" title="Youtube" width="32"></a>'+
                                            '</td>'+
                                            '<td class="es-p10r" valign="top" align="center">'+
                                                '<a target="_blank" href="https://www.linkedin.com/in/mohamed-habib-m-sahel-9bb5a0217/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/linkedin-rounded-gray.png" alt="In" title="Linkedin" width="32"></a>'+
                                            '</td>'+
                                                '</tr>'+
                                            '</tbody>'+
                                        '</table>'+
                                    '</td>'+
                                '</tr>'+
                           '</tbody>'+
                        '</table>'+
                    '</td>'+
                '</tr>'+
            '</tbody>'+
        '</table>'+
    '</td>'+
    //contact us
    '<tbody>'+
            '<tr>'+
    '<td class="esd-structure es-p5t es-p20b es-p20r es-p20l" align="left">'+
        '<table width="100%" cellspacing="0" cellpadding="0">'+
            '<tbody>'+
                '<tr>'+
                    '<td class="esd-container-frame" width="560" valign="top" align="center">'+
                        '<table width="100%" cellspacing="0" cellpadding="0">'+
                            '<tbody>'+
                                '<tr>'+
                                    '<td class="esd-block-text" esd-links-color="#666666" align="center">'+
                                        '<p style="font-size: 14px;">Contact us: <a target="_blank" style="font-size: 14px; color: #666666;" href="tel:123456789">+216 29 473 912</a> | <a target="_blank" href="mailto:m\'sahel.mohamedhabib@esprit.tn" style="font-size: 14px; color: #666666;">m\'sahel.mohamedhabib@esprit.tn</a></p>'+
                                    '</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</td>'+
                '</tr>'+
            '</tbody>'+
        '</table>'+
    '</td>'+
            //have any question
            '<tbody>'+
            '<tr>'+
            '<td class="esd-structure es-p10t es-p30b es-p20r es-p20l" style="background-color: #0b5394;" bgcolor="#0b5394" align="left">'+
        '<table width="100%" cellspacing="0" cellpadding="0">'+
            '<tbody>'+
                '<tr>'+
                    '<td class="esd-container-frame" width="560" valign="top" align="center">'+
                        '<table width="100%" cellspacing="0" cellpadding="0">'+
                            '<tbody>'+
                                '<tr>'+
                                    '<td class="esd-block-text es-p5t es-p5b" align="left" style="padding-left: 20px;">'+
                                        '<h2 style="font-size: 16px; color: #ffffff;"><strong>Have quastions?</strong></h2>'+
                                    '</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td esd-links-underline="none" esd-links-color="#ffffff" class="esd-block-text es-p5b" align="left">'+
                                        '<p style="font-size: 14px; padding-left: 20px; color: #ffffff;">We are here to help, learn more about us <a target="_blank" style="font-size: 14px; color: #ffffff; text-decoration: none;">here</a></p>'+
                                        '<p style="font-size: 14px; padding-left: 20px; color: #ffffff;">or <a target="_blank" style="font-size: 14px; text-decoration: none; color: #ffffff;">contact us</a><br></p>'+
                                    '</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</td>'+
                '</tr>'+
            '</tbody>'+
        '</table>'+
    '</td>'+
    '</tr>'+
    '</tbody>'+
    '</table>'+
    '</div>'
          }
          smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
              return res.status(500).send({ msg: err });
            }
          });
        res.status(201).json({token:tokenJWT,
                            user:newUser,
                            reponse: "good"})
    } catch (error) {
        res.status(400).json({reponse: error.message})
    }
}

exports.downloadimage = async(req, res) => {
    let nom = req.params.nom;
    const file = picsPath + "/" + nom;
    console.log(file, "hy");
    res.sendFile(file); // Set disposition and send it.
}


// exports.create = (req, res) => {
//     // Validate request
//     if(!req.body.nom) {
//         return res.status(400).send({
//             message: "User content can not be empty"
//         });
//     }
  


//     // Create a Note
//     let newuser = new User({
//         nom : req.body.nom || "Untitled Note",
//         prenom : req.body.prenom ,
//         email :req.body.email ,
//         password :req.body.password ,
//         phone :req.body.phone ,
//         address :req.body.address,
//         job :req.body.job,
//         urlImg : `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`

//     });
//     console.log(newuser.urlImg)
// // Hash password before saving in database
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(newuser.password, salt, (err, hash) => {
//       if (err) throw err;
//       newuser.password= hash;
//       newuser.save()
        
//         .then(client => res.json({user:client}))
//         .catch(err => console.log(err));
//     });
//   });
  
  
// };
//forgotpassword
exports.forgotPassword = async(req, res,next) => {

    // user is not found into database
    if (!res.user) {
      return res.status(400).send({ msg: 'The email entred was not found by our system. Make sure your Email is correct!' });
    } else {
      var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      var token = new Token({ email: res.user.email, token: seq });
      token.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
  
      });
  
      var smtpTrans = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "m'sahel.mohamedhabib@esprit.tn",
          pass: process.env.EMAIL_MDP
        }
      });
  
      var mailOptions = {
        from: "m'sahel.mohamedhabib@esprit.tn",
        to: res.user.email,
        subject:'Reset Password',
       /* text: 'You receive this email from Khadamni application bellow you will find a link please click on it\n\n' +
            'The code is  :' + token.token + '\n\n' +
            'http:\/\/' + req.headers.host + '\/users\/resetPassword\/' + res.user.email + '\/' + token.token
            + '\n\n Si vous n\'avez pas fait cette requete, veuillez ignorer ce message et votre mot de passe sera le méme.\n'*/
            html:  '<div class="es-wrapper-color">'+
            '<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">'+
            //HEADER
            '<tbody>'+
                '<tr>'+
            '<td class="esd-structure es-p20t es-p20b es-p20r es-p20l" style="background-color: #3d5ca3;" bgcolor="#3d5ca3" align="left">'+
            '<table class="es-left" cellspacing="0" cellpadding="0" align="center">'+
            '<tbody>'+
                '<tr>'+
                '<td class="es-m-p20b esd-container-frame" width="270" align="left">'+
                    '<table width="100%" cellspacing="0" cellpadding="0">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="esd-block-image es-m-p0l es-m-txt-c" align="center" style="font-size: 0px;padding: 20px">'+
                                    '<a href="https://www.facebook.com/Khadamni-100921899214016/" target="_blank"><img src="https://fv9-6.failiem.lv/thumb_show.php?i=26a9n6fcj&view" alt style="display: block; border-radius: 8px;" width="183"></a>'+
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</td>'+
           ' </tr>'+
        '</tbody>'+
    '</table>'+
'</td>'+
            //container 
            '<tbody>'+
                '<tr>'+
            '<td class="esd-structure es-p40t es-p20r es-p20l" style="background-color: transparent;" bgcolor="transparent" align="left">'+
            '<table width="100%" cellspacing="0" cellpadding="0">'+
                '<tbody>'+
                    '<tr>'+
                        '<td class="esd-container-frame" width="560" valign="top" align="center">'+
                            '<table style="background-position: left top;" width="100%" cellspacing="0" cellpadding="0">'+
                               '<tbody>'+
                                    '<tr>'+
                                        '<td class="esd-block-image es-p5t es-p5b" align="center" style="font-size:0">'+
                                            '<a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt style="display: block;" width="175"></a>'+
                                        '</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td class="esd-block-text es-p15t es-p15b" align="center">'+
                                            '<h1 style="color: #333333; font-size: 20px;"><strong>FORGOT YOUR </strong></h1>'+
                                            '<h1 style="color: #333333; font-size: 20px;"><strong>&nbsp;PASSWORD?</strong></h1>'+
                                        '</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td class="esd-block-text es-p40r es-p40l" align="center">'+
                                        '<p>HI,'+res.user.nom+' '+res.user.prenom+'</p>'+
                                        '</td>'+
                                    '</tr>'+
                                   '<tr>'+
                                        '<td class="esd-block-text es-p35r es-p40l" align="left">'+
                                            '<p style="text-align: center;">There was a request to change your password!</p>'+
                                        '</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td class="esd-block-text es-p25t es-p40r es-p40l" align="center">'+
                                            '<p>If did not make this request, just ignore this email. Otherwise, please copy the code bellow and past it on the app</p>'+
                                        '</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td class="esd-block-text es-p25t es-p40r es-p40l" align="center">'+
                                            '<p>This is the code:'+token.token+'</p>'+
                                        '</td>'+
                                    '</tr>'+
                                '</tbody>'+
                            '</table>'+
                       '</td>'+
                    '</tr>'+
                '</tbody>'+
            '</table>'+
        '</td>'+
        //follow us
        '<tbody>'+
        '<tr>'+
        '<td class="esd-structure es-p20t es-p10r es-p10l" align="left">'+
    '<table class="es-left" cellspacing="0" cellpadding="0" align="left">'+
        '<tbody>'+
            '<tr>'+
                '<td class="esd-container-frame" width="199" align="left">'+
                    '<table style="background-position: center center;" width="100%" cellspacing="0" cellpadding="0">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="esd-block-text es-p15t es-m-txt-c" align="right">'+
                                    '<p style="font-size: 16px; color: #666666;"><strong>Follow us:</strong></p>'+
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</td>'+
            '</tr>'+
        '</tbody>'+
    '</table>'+
    '<table class="es-right" cellspacing="0" cellpadding="0" align="right">'+
        '<tbody>'+
            '<tr>'+
                '<td class="esd-container-frame" width="361" align="left">'+
                    '<table style="background-position: center center;" width="100%" cellspacing="0" cellpadding="0">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="esd-block-social es-p10t es-p5b es-m-txt-c" align="left" style="font-size:0">'+
                                    '<table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0">'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td class="es-p10r" valign="top" align="center">'+
                                                    '<a target="_blank" href="https://www.facebook.com/Khadamni-100921899214016/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/facebook-rounded-gray.png" alt="Fb" title="Facebook" width="32"></a>'+
                                                '</td>'+
                                                '<td class="es-p10r" valign="top" align="center">'+
                                                    '<a target="_blank" href="https://www.facebook.com/Khadamni-100921899214016/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/twitter-rounded-gray.png" alt="Tw" title="Twitter" width="32"></a>'+
                                                '</td>'+
                                                '<td class="es-p10r" valign="top" align="center">'+
                                                    '<a target="_blank" href="https://www.instagram.com/mohamedhbib.msahel/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png" alt="Ig" title="Instagram" width="32"></a>'+
                                                '</td>'+
                                                '<td class="es-p10r" valign="top" align="center">'+
                                                    '<a target="_blank" href="https://www.youtube.com/channel/UCgq2WxpWzdiu9pAaNB8Q3dw"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/youtube-rounded-gray.png" alt="Yt" title="Youtube" width="32"></a>'+
                                                '</td>'+
                                                '<td class="es-p10r" valign="top" align="center">'+
                                                    '<a target="_blank" href="https://www.linkedin.com/in/mohamed-habib-m-sahel-9bb5a0217/"><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/linkedin-rounded-gray.png" alt="In" title="Linkedin" width="32"></a>'+
                                                '</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</td>'+
                            '</tr>'+
                       '</tbody>'+
                    '</table>'+
                '</td>'+
            '</tr>'+
        '</tbody>'+
    '</table>'+
'</td>'+
//contact us
'<tbody>'+
        '<tr>'+
'<td class="esd-structure es-p5t es-p20b es-p20r es-p20l" align="left">'+
    '<table width="100%" cellspacing="0" cellpadding="0">'+
        '<tbody>'+
            '<tr>'+
                '<td class="esd-container-frame" width="560" valign="top" align="center">'+
                    '<table width="100%" cellspacing="0" cellpadding="0">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="esd-block-text" esd-links-color="#666666" align="center">'+
                                    '<p style="font-size: 14px;">Contact us: <a target="_blank" style="font-size: 14px; color: #666666;" href="tel:123456789">+216 29 473 912</a> | <a target="_blank" href="mailto:m\'sahel.mohamedhabib@esprit.tn" style="font-size: 14px; color: #666666;">m\'sahel.mohamedhabib@esprit.tn</a></p>'+
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</td>'+
            '</tr>'+
        '</tbody>'+
    '</table>'+
'</td>'+
        //have any question
        '<tbody>'+
        '<tr>'+
        '<td class="esd-structure es-p10t es-p30b es-p20r es-p20l" style="background-color: #0b5394;" bgcolor="#0b5394" align="left">'+
    '<table width="100%" cellspacing="0" cellpadding="0">'+
        '<tbody>'+
            '<tr>'+
                '<td class="esd-container-frame" width="560" valign="top" align="center">'+
                    '<table width="100%" cellspacing="0" cellpadding="0">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="esd-block-text es-p5t es-p5b" align="left" style="padding-left: 20px;">'+
                                    '<h2 style="font-size: 16px; color: #ffffff;"><strong>Have quastions?</strong></h2>'+
                                '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td esd-links-underline="none" esd-links-color="#ffffff" class="esd-block-text es-p5b" align="left">'+
                                    '<p style="font-size: 14px; padding-left: 20px; color: #ffffff;">We are here to help, learn more about us <a target="_blank" style="font-size: 14px; color: #ffffff; text-decoration: none;">here</a></p>'+
                                    '<p style="font-size: 14px; padding-left: 20px; color: #ffffff;">or <a target="_blank" style="font-size: 14px; text-decoration: none; color: #ffffff;">contact us</a><br></p>'+
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</td>'+
            '</tr>'+
        '</tbody>'+
    '</table>'+
'</td>'+
'</tr>'+
'</tbody>'+
'</table>'+
'</div>'
      };
      // Send email (use credintials of SendGrid)
  
      console.log(token.token)
      //  var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
      smtpTrans.sendMail(mailOptions, function (err) {
        if (err) {
          return res.status(500).send({ msg: err });
        }
        else {
          return res.status(200).send({
            succes: true,
            msg: 'A reset password  email has been sent to ' + res.user.email + '. It will be expire after one day. ',
            token: token.token
          })
        };
  
      });
  
    }
  
  }
/*exports.forgotPassword = async(req, res,next) => {

    // user is not found into database
    if (!res.user) {
        return res.status(400).send({ msg: 'We were unable to find a user with that email. Make sure your Email is correct!' });
    } else {
        var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        var token = new Token({ email: res.user.email, token: seq });
        token.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }

        });

        var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fanart3a18@gmail.com',
                pass: 'Nf9rwxfbMohamedmalek93!'
            }
        });

        var mailOptions = {
            from: 'fanart3a18@gmail.com', to: res.user.email, subject:
                'Mot de passe oubliè khadamni', text: 'Vous recevez cet email car vous (ou quelqu\'n d\'autre) a fait cette demande de mot de passe oubliè.\n\n' +
                    'Merci de cliquer sur le lien suivant ou copier le sur votre navigateur pour completer le processus:\n\n' + 'Le code est :'+ token.token + '\n\n' +
                    '\n\n Si vous n\'avez pas fait cette requete, veuillez ignorer ce message et votre mot de passe sera le méme.\n'
        };
        // Send email (use credintials of SendGrid)

        //  var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
        smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).send({ msg: err });
            }
            else {
                return res.status(200).send({succes:true, 
                    msg:'A reset password  email has been sent to ' + res.user.email + '. It will be expire after one day. If you not get verification Email click on resend token.',
                    token: token.token
                })};

        });

    }

}*/
// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    console.log()
    User.find()
    .then(users => {
        console.log("users:"+users)
        res.json({users:users});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.userId
        });
    });
};

// Find a single note with a noteId
exports.findOneEmail = (req, res, next) => {
    
    User
    .find({email: req.params.Email})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "user not found with email " + req.params.Email
            });            
        }x
        res.send(note);
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.Email
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.Email
        });
    });
    next();
};

// Update a note identified by the noteId in the request
exports.update = async(req, res) => {
    console.log("mani nessi lefri9i enti 3inaya")
    if (req.file != null) {
        const photoCloudinary = await cloudinary.uploader.upload(req.file.path)
        //const photoCloudinary = await cloudinary.uploader.upload(req.file.filename)
        req.body.urlImg = photoCloudinary.url
      } else {
        req.body.urlImg  = "https://res.cloudinary.com/dy05x9auh/image/upload/v1648226974/athlete_lxnnu3.png"
      }
    User.findByIdAndUpdate(req.params.userId, {
        nom : req.body.nom ,
        prenom : req.body.prenom ,
        email :req.body.email ,
        phone :req.body.phone ,
        address :req.body.address,
        job :req.body.job,
        urlImg : req.body.urlImg
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });
        }
        res.json({reponse:"updated",
        user:note})
        
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.userId
        });
    });
};
//get user by id
    exports.getUserById = async(req, res,next) => {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({reponse : "Utilisateur non trouve"})
        }
    } catch (error) {
        return res.status(500).json({reponse: error.message})
    }
    res.user = user
    next()
}
// Delete a note with the specified noteId in the request
//router.delete ('/:id',getUserById,async (req,res) => {
    exports.delete = async(req, res) => {
    try {
        //delete the user
         await res.user.remove()
         res.json({reponse : "Supprime avec succes"})
    } catch (error) {
        res.json({erreur : error.message})
    }
}
/* exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.userId
        });
    });
};
*/

// Find a single note with a noteId
exports.findclient = (req, res) => {
    // Find client by email
    User.findOne({email: req.body.email}).then(client => {
        // Check if client exists
        if (!client) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }
      // Check password
          bcrypt.compare(req.body.password, client.password)
          .then(isMatch => {
            if (isMatch) {
              // client matched
              // Create JWT Payload
              const payload = {
                id: client._id,
                email : client.email
              };
      // Sign token
              jwt.sign(
                payload,
                "secret",
                {
                  expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token:"Bearer "+ token,
                
                    id : client._id
                  });
                }
              );
            } else {
              return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
            }
          });
        });
};


// Find a single note with a noteId
exports.findtoken = (req, res) => {
   
    const headers = req.headers['authorization']
    console.log(headers)
    if(headers) {
      // Bearer oabsdoabsoidabsiodabsiodbasoid
      const token = headers.split(' ')[1]
      const decoded = jwt.verify(token, 'secret')
      
      if(decoded) {
        let username = decoded.id
        console.log("////////////////////////////////////////////////////")
        console.log(username)
        User.findById(username)
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });            
            }
            res.send(note);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });                
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + username
            });
        });
      } else {
        res.json({message: 'Unauthorized access'})
      }
      
    } else {
      res.json({message: 'Unauthorized access'})
    }
};

exports.findtokenall = (req, res) => {
   
    const headers = req.headers['authorization']
    console.log(headers)
    if(headers) {
      // Bearer oabsdoabsoidabsiodabsiodbasoid
      const token = headers.split(' ')[1]
      const decoded = jwt.verify(token, 'secret')
      
      if(decoded) {
        let username = decoded.id
        console.log("////////////////////////////////////////////////////")
        console.log(username)
        User.find()
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });            
            }
            res.send(note);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + username
                });                
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + username
            });
        });
      } else {
        res.json({message: 'Unauthorized access'})
      }
      
    } else {
      res.json({message: 'Unauthorized access'})
    }
};
//creating one Using Social Media
exports.socialmedia = (req, res) => {

    const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        address: "no address",
        job: "no job",
        phone: "no phone",
        urlImg: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    })
    console.log(user)
    const tokenJWT = jwt.sign({username: req.body.email}, "SECRET")

    
    try {
        const newUser =  user.save()
        
        res.status(201).json({token:tokenJWT,
            user:user,
        reponse: "good"})
} catch (error) {
res.status(400).json({reponse: error.message})
}
       /* var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fanart3a18@gmail.com',
                pass: '3A18java123'
            }
        });


        var mailOptions = { from: 'fanart3a18@gmail.com', to: user.email, subject: 'Verification de compte', text: 'Bonjour/Bonsoir ' + user.nom + ',\n\n' + 'Pour verifier votre compte merci de cliquer sur le lien suivant: \nhttp:\/\/' + req.headers.host + '\/user\/confirmation\/' + user.email + '\/' + token.token + '\n\nMerci !\n' };
        smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });

            }
            return res.status(200)
                .json(
                    {
                        msg: 'A verification email has been sent to ' + user.email +
                            '. It will be expire after one day. If you not get verification Email click on resend token.',
                        user: user
                    });
        });*/
        // res.status(201).json({
        //     success: true,
        //     message: "User Created!",
        //     user: user
        // });


   
};
//login

   /* exports.login = async(req, res) => {
    if (res.user == null){
        return res.status(404).send("Utilisateur introuvable")
    }
        try {
            if (await bcrypt.compare(req.body.password,res.user.password)){
                const token = jwt.sign({username: res.user.email}, "SECRET")
                if (token){
                    res.status(201).json({token: token,
                    user:res.user,
                    reponse:"good"})
                }
            }else{
                res.status(201).json({
                user:res.user
                }) 
                console.log(res.user)
            }  
        } catch (error) {
            res.status(400).json({reponse : "mdp incorrect"})
        } 
    }*/
    exports.login = async(req, res) => {
        console.log("aaaaaaaaaaaaaa")
        if (res.user == null) {
            return res.status(404).send("Utilisateur introuvable")
          }
          try {
            console.log(req.body.password)
            console.log(res.user.password)
        
            if (await bcrypt.compare(req.body.password, res.user.password)) {
              const token = jwt.sign({ email: res.user.email }, "SECRET")
              if (token) {
                res.json({
                  token: token,
                  user: res.user,
                  reponse: "Success"
                })
              }
            } else
              res.json({
                nom: res.user.nom,
                prenom: res.user.prenom,
                email: res.user.email,
                password: hashedPass,
                phone: res.user.phone,
                address: res.user.address,
                job: res.user.job,
                urlImg: res.user.urlImg
              })
        
          } catch (error) {
            res.status(400).json({ reponse: "mdp incorrect" })
          }
        }
//resestpassword
exports.resetPassword = async(req, res,next) => {
    console.log("Ena body")
    console.log("Ena body" + req.body.email)
  
    console.log("Ena pass" + req.body.password)
    Token.findOne({ token: req.body.token }, function (err, token) {
      // token is not found into database i.e. token may have expired 
      if (!token) {
        return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
      }
      // if token is found then check valid user 
      else {
        User.findOne({ email: req.body.email }, async function (err, user) {
          // not valid user
          if (!user) {
            return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
          } else {
  
            const salt = await bcrypt.genSalt(10);
            console.log(salt)
            console.log(req.body.password, "This is the pass")
            const hashedp = await bcrypt.hash(req.body.password, salt);
  
  
            user.password = hashedp
  
            user.save(function (err) {
              // error occur
              if (err) {
                return res.status(500).send({ msg: err.message });
              }
              // account successfully verified
              else {
                return res.status(200).json({ msg: 'Your password has been successfully reset' });
              }
  
            })
  
          }
  
        });
      }
    });
  
  }
/*
    exports.resetPassword = async(req, res,next) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token) {
            return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        }
        // if token is found then check valid user 
        else {
            User.findOne({email: req.params.email }, async function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                } else {

                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(req.body.Password, salt);

                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        // account successfully verified
                        else {
                            return res.status(200).json({reponse:'Your password has been successfully reset'});
                        }

                    })

                }

            });
        }});

    }*/
// send mail
exports.sendmaill = (req, res) => {
   
  
    async function main() {
   
        let transporter = nodemailer.createTransport({
          service: 'gmail',
         
          auth: {
              user: 'gouidersaif@gmail.com',
              pass: 'saifOUN10'
          },
       });
      
     
       
      // send mail with defined transport object
      let info = await transporter.sendMail({
          from: 'gouidersaif@gmail.com',
          to: req.body.email,
          subject: 'Verification account',
          text: req.body.code
      });
      console.log("Message sent: %s", info.messageId);
     
    }
    main().catch(console.error);
  
  
};
//Auth
exports.Auth = async(req, res,next) => {
    if (res.user == null){
        return res.status(404).send("Utilisateur introuvable")
    }
    try {
        const token = jwt.sign({username: res.user.email}, "SECRET")
        if (token){
            res.json({token: token,
            user:res.user,
            reponse:"good"})
        }
        
        
    } catch (error) {
        res.status(400).json({reponse : "mdp incorrect"})
    } 
    next();
};
exports.getUserByMail = async(req, res,next) => {
    let user
    try {
        user = await User.findOne({email:req.body.email})
        if (user == null){
            return res.status(404).json({reponse : "mail non trouve"})
        }

    } catch (error) {
        return res.status(500).json({reponse: error.message})
    }
    res.user = user
    next()
}

  
//send SMS


exports.sendnumber = (req, res) => {
   
const nexmo = new Nexmo({
    apiKey: "d3311679",
  apiSecret: "AyEH3YNyBayZZ552"
});
var to = req.body.phone;
var from = 'KHADEMNI';
var text = req.body.code;


nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
  
};