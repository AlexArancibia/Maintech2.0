import { NextRequest, NextResponse } from "next/server";
import { createPaymentPreference } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extraer datos
    const coursePriceStr = formData.get('coursePrice') as string;
    const userEmail = formData.get('userEmail') as string;
    const courseId = formData.get('courseId') as string;
    const userIdStr = formData.get('userId') as string;

    // Validar campos requeridos
    if (!coursePriceStr || !userEmail || !courseId || !userIdStr) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Convertir y validar datos
    const coursePrice = parseFloat(coursePriceStr);
    const userId = parseInt(userIdStr);

    if (isNaN(coursePrice) || coursePrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Precio inválido" },
        { status: 400 }
      );
    }

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { success: false, error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    // Crear preferencia de pago
    const result = await createPaymentPreference({
      coursePrice,
      userEmail,
      courseId,
      userId
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        redirectUrl: result.initPoint
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in redirect-mercadopago API:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 