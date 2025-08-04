import { Payment } from "mercadopago";
import { revalidatePath } from "next/cache";
import { mercadopago } from "@/lib/mercadopago";
import api from "@/lib/axios";

export async function POST(request: Request) {
  try {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("MERCADOPAGO_ACCESS_TOKEN not configured");
      return new Response("OK", { status: 200 });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing webhook body:", parseError);
      return new Response("OK", { status: 200 });
    }

    // Solo procesar notificaciones de pagos
    if (body.type !== "payment") {
      return new Response("OK", { status: 200 });
    }

    const paymentId = body.data?.id || body.id;
    if (!paymentId) {
      return new Response("OK", { status: 200 });
    }

    // Procesar el webhook de forma asíncrona
    processWebhookAsync(body, paymentId);

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Error en el manejador del webhook:", error);
    return new Response("OK", { status: 200 });
  }
}

async function processWebhookAsync(body: any, paymentId: string) {
  try {
    // Obtener detalles del pago
    let paymentDetails = null;

    try {
      const payment = await new Payment(mercadopago).get({ id: paymentId });
      paymentDetails = payment;
    } catch (error: any) {
      console.error("Error al obtener el pago de MercadoPago:", error.message);
      return;
    }

    if (!paymentDetails) {
      console.error("No se pudieron obtener los detalles del pago");
      return;
    }

    // Procesar solo pagos aprobados
    if (paymentDetails.status === "approved") {
      const metadata = paymentDetails.metadata;
      if (!metadata) {
        console.error("No se encontró metadata en el pago");
        return;
      }

      // Extraer datos de metadata (MercadoPago usa guiones bajos)
      const courseId = metadata.course_id || metadata.courseId;
      const userId = metadata.user_id || metadata.userId;

      if (!courseId || !userId) {
        console.error("Faltan datos requeridos en metadata:", metadata);
        return;
      }

      // Vincular curso al usuario
      const payload = {
        data: {
          users_permissions_users: {
            connect: [parseInt(userId)],
          },
        },
      };

      try {
        await api.put(`/api/courses/${courseId}`, payload);
        console.log("Curso vinculado exitosamente al usuario");
        revalidatePath("/dashboard");
      } catch (apiError: any) {
        console.error("Error al vincular curso:", apiError.message);
      }
    }

  } catch (error: any) {
    console.error("Error en async webhook processing:", error.message);
  }
} 