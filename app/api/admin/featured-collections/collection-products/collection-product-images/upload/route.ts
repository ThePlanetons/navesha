// // app/api/admin/featured-collections/collection-products/collection-product-images/upload/route.ts

// import { NextResponse } from "next/server";

// import { supabaseAdmin } from "@/lib/supabase/admin";

// import sharp from "sharp";

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();

//     const file = formData.get("file") as File;
//     const mockupId = formData.get("mockup_id");

//     if (!file) {
//       throw new Error("File is required");
//     }

//     // if (!mockupId) {
//     //   throw new Error("Mockup is required");
//     // }

//     // -------------------------
//     // File validation
//     // -------------------------

//     if (!file.type.startsWith("image/")) {
//       throw new Error("Only image files are allowed");
//     }

//     // --------------------------------------------------
//     // Get mockup
//     // --------------------------------------------------

//     const { data: mockup, error: mockupError } = await supabaseAdmin
//       .from("mockups")
//       .select("*")
//       .eq("id", mockupId)
//       .single();

//     if (mockupError || !mockup) {
//       throw new Error("Mockup not found");
//     }

//     // --------------------------------------------------
//     // Download mockup image
//     // --------------------------------------------------

//     const mockupResponse = await fetch(
//       mockup.image_url
//     );

//     const mockupBuffer = Buffer.from(
//       await mockupResponse.arrayBuffer()
//     );

//     // --------------------------------------------------
//     // Uploaded poster
//     // --------------------------------------------------

//     const posterBuffer = Buffer.from(
//       await file.arrayBuffer()
//     );

//     // --------------------------------------------------
//     // Resize poster to frame size
//     // --------------------------------------------------

//     const resizedPoster = await sharp(posterBuffer)
//       .resize(
//         mockup.frame_width,
//         mockup.frame_height,
//         {
//           fit: "cover",
//         }
//       )
//       .png()
//       .toBuffer();

//     // --------------------------------------------------
//     // Merge poster into mockup
//     // --------------------------------------------------

//     console.log("1");
//     const generatedImage = await sharp(mockupBuffer)
//       .composite([
//         {
//           input: resizedPoster,
//           left: mockup.frame_x,
//           top: mockup.frame_y,
//         },
//       ])
//       .png()
//       .toBuffer();

//     const uploadData = new Uint8Array(generatedImage);

//     console.log("2", generatedImage.length);

//     console.log("3");

//     // --------------------------------------------------
//     // Upload generated image
//     // --------------------------------------------------

//     // const extension = file.name.split(".").pop();

//     const fileName = `collection-products/${Date.now()}-${crypto.randomUUID()}.png`;

//     // -------------------------
//     // Upload to storage
//     // -------------------------

//     const { error: uploadError, } = await supabaseAdmin.storage
//       .from("uploads")
//       .upload(
//         fileName,
//         uploadData,
//         {
//           contentType: "image/png",
//           cacheControl: "3600",
//           upsert: false,
//         }
//       );

//     console.log("4");

//     if (uploadError) {
//       throw new Error(uploadError.message);
//     }

//     // -------------------------
//     // Get public URL
//     // -------------------------
//     console.log("Upload done");
//     const { data: publicUrlData, } = supabaseAdmin.storage
//       .from("uploads")
//       .getPublicUrl(
//         fileName
//       );

//     console.log("Public URL:", publicUrlData.publicUrl);

//     console.log("Returning response");

//     return NextResponse.json(
//       {
//         success: true,
//         url: publicUrlData.publicUrl,
//       }
//     );
//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);

//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : String(error),
//         stack: error instanceof Error ? error.stack : undefined,
//       },
//       {
//         status: 500,
//       }
//     );

//     // return NextResponse.json(
//     //   {
//     //     error: error instanceof Error ? error.message : String(error),
//     //   },
//     //   {
//     //     status: 500,
//     //   }
//     // );
//   }
// }


// app/api/admin/featured-collections/collection-products/collection-product-images/upload/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("File is required");
    }

    // -------------------------
    // File validation
    // -------------------------

    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // -------------------------
    // Generate filename
    // -------------------------

    const extension = file.name.split(".").pop();

    const fileName = `collection-products/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    // -------------------------
    // Upload to storage
    // -------------------------

    const { error: uploadError, } = await supabaseAdmin.storage
      .from("uploads")
      .upload(
        fileName,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // -------------------------
    // Get public URL
    // -------------------------

    const { data: publicUrlData, } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(
        fileName
      );

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}