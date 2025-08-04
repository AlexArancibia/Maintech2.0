import { MercadoPagoConfig, Preference } from "mercadopago";

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is not configured");
}

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not configured");
}

export const mercadopago = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export const createPaymentPreference = async (data: {
  coursePrice: number;
  userEmail: string;
  courseId: string;
  userId: number;
}) => {
  try {
    // Validar precio
    if (isNaN(data.coursePrice) || data.coursePrice <= 0) {
      throw new Error("Precio inválido - debe ser mayor a 0");
    }

    const preferenceBody = {
      items: [{
        id: data.courseId,
        unit_price: Number(data.coursePrice),
        quantity: 1,
        title: "Curso",
      }],
      payer: {
        email: data.userEmail,
      },
      metadata: {
        course_id: data.courseId,
        user_id: data.userId.toString(),
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?error=payment_failed`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?status=pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago`,
    };

    const preference = await new Preference(mercadopago).create({
      body: preferenceBody,
    });
    
    return {
      success: true,
      initPoint: preference.init_point,
      preferenceId: preference.id,
    };
  } catch (error: any) {
    console.error("Error creating payment preference:", error.message);
    return {
      success: false,
      error: "Error al crear preferencia de pago",
    };
  }
}; 