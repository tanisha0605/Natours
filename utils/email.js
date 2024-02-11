const nodemailer=require('nodemailer');
const pug=require('pug');
const htmlToText = require('html-to-text');


module.exports=class Email{
    constructor(user,url){
        this.to=user.email;
        this.firstName=user.name.split(' ')[0];
        this.url=url;
        this.from=`Tanisha Kanal <${process.env.EMAIL_FROM}> `;
    }
    newTransport(){
        if(process.env.NODE_ENV === 'production'){
            return 1;
        }
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }
            //Activate in gmail "less secure app" option
        });    
    }
    //Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
          firstName: this.firstName,
          url: this.url,
          subject
        });
        //const text= htmlToText.fromString(html)
        // 2) Define email options
        const mailOptions = {
          from: this.from,
          to: this.to,
          subject,
          html,
          //text
        };
    
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
      }
    async sendWelcome(){
        await this.send('Welcome','Welcome to Natours Family');
    }
    async sendPasswordReset(){
        await this.send(
            'passwordReset',
            'Your password reset token(Valid for only 10 minutes)'
            );
    }
}


