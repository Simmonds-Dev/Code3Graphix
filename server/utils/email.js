// utils/email.js
import path from 'path';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderEmail = async (fullOrder, filePath) => {
    const user = fullOrder.user;
    const product = fullOrder.order_items?.[0]?.product;

    if (!user?.user_email) {
        throw new Error('User email is missing from order data');
    }

    const mailOptions = {
        from: `"Order Bot" <${process.env.EMAIL_USER}>`,
        to: user.user_email,
        subject: `Order Confirmation: ${product?.product_name || 'Product'}`,
        text: `
Hello ${user.user_name || 'Customer'},

Thank you for your order. Here are the details:

Product: ${product.product_name || 'N/A'}
Description: ${fullOrder.description}
Quantity: ${fullOrder.quantity}
Color: ${fullOrder.color}
Size: ${fullOrder.size}
Urgency: ${fullOrder.urgency}
Message: ${fullOrder.message || 'None'}

Attached is the file you uploaded.

Regards,
Code3Graphix
    `,
        attachments: filePath
            ? [
                {
                    filename: path.basename(filePath),
                    path: filePath,
                },
            ]
            : [],
    };

    return transporter.sendMail(mailOptions);
};
