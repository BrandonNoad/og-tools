import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { z } from "zod";

import type { ZodType } from "zod";

export const runtime = "edge";

type Style = {
  backgroundColor: string;
  color: string;
  padding: number;
};

const templateSearchParamSchema = z.enum(["tdg"]);

type Template = z.infer<typeof templateSearchParamSchema>;

const defaultStyle: Style = {
  backgroundColor: "white",
  color: "black",
  padding: 40,
};

const DGL_LOGO_DATA_URL =
  "data:image/png;base64,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";

const getDataForTemplate = (
  template?: Template
): { style: Partial<Style>; logoSrc: string | null } => {
  const defaultData = { style: {}, logoSrc: null };

  if (!template) {
    return defaultData;
  }

  switch (template) {
    case "tdg":
      return {
        style: {
          ...defaultStyle,
          backgroundColor: "black",
          color: "white",
        },
        logoSrc: DGL_LOGO_DATA_URL,
      };

    default:
      return defaultData;
  }
};

const searchParamsSchema = z.object({
  content: z.string(),
  template: templateSearchParamSchema.optional(),
  aspectRatio: z.enum(["1:1", "1.91:1"]).optional(),
});

const numericEnum = <TValues extends readonly number[]>(values: TValues) =>
  z.number().superRefine((val, ctx) => {
    if (!values.includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        options: [...values],
        received: val,
      });
    }
  }) as ZodType<TValues[number]>;

const FONT_WEIGHTS = [400, 600, 700] as const;

const fontWeightSchema = numericEnum(FONT_WEIGHTS);
const styleSchema = z.object({
  fontSize: z.number().optional(),
  fontWeight: fontWeightSchema.optional(),
  color: z.string().optional(),
});
const contentSchema = z.object({
  style: styleSchema.optional(),
  data: z.array(
    z.union([
      z.string(),
      z.object({
        text: z.string(),
        style: styleSchema.optional(),
      }),
    ])
  ),
});

type FontWeight = z.infer<typeof fontWeightSchema>;

type Content = z.infer<typeof contentSchema>;

export async function GET(request: Request) {
  const url = new URL(request.url);

  const searchParamsParseResult = searchParamsSchema.safeParse({
    content: url.searchParams.get("content"),
    template: url.searchParams.get("template") ?? undefined,
    aspectRatio: url.searchParams.get("aspectRatio") ?? undefined,
  });

  if (!searchParamsParseResult.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: "Bad Request",
      },
      { status: 400 }
    );
  }

  const {
    content: contentJson,
    template,
    aspectRatio,
  } = searchParamsParseResult.data;

  let content: Content = { data: [] };
  try {
    content = contentSchema.parse(JSON.parse(contentJson));
  } catch (err) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: "Bad Request",
      },
      { status: 400 }
    );
  }

  const templateData = getDataForTemplate(template);

  const frameStyle: Style = {
    ...defaultStyle,
    ...templateData.style,
  };

  // The URLs are not allowed to contain any variables.
  const fontMeta: Array<{
    url: URL;
    name: string;
    weight: FontWeight;
  }> = [
    {
      url: new URL(
        `../../../../../public/fonts/OpenSans-Regular.ttf`,
        import.meta.url
      ),
      name: "Open Sans",
      weight: 400,
    },
    {
      url: new URL(
        `../../../../../public/fonts/OpenSans-SemiBold.ttf`,
        import.meta.url
      ),
      name: "Open Sans",
      weight: 600,
    },
    {
      url: new URL(
        `../../../../../public/fonts/OpenSans-Bold.ttf`,
        import.meta.url
      ),
      name: "Open Sans",
      weight: 700,
    },
  ];

  const fonts = await Promise.all(
    fontMeta.map(async ({ url, name, weight }) => ({
      name,
      weight,
      data: await fetch(url).then((res) => res.arrayBuffer()),
    }))
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "nowrap",
          width: "100%",
          height: "100%",
          backgroundColor: frameStyle.backgroundColor,
          padding: frameStyle.padding,
        }}
      >
        {templateData.logoSrc ? (
          <img
            src={templateData.logoSrc}
            alt="logo"
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              width: 40,
              height: 40,
            }}
          />
        ) : null}
        {content.data.map((datum, idx) => {
          const text = typeof datum === "string" ? datum : datum.text;

          const fontSize =
            (typeof datum === "string" ? null : datum.style?.fontSize) ??
            content.style?.fontSize ??
            28;

          const fontWeight =
            (typeof datum === "string" ? null : datum.style?.fontWeight) ??
            content.style?.fontWeight ??
            400;

          const color =
            (typeof datum === "string" ? null : datum.style?.color) ??
            content.style?.color ??
            frameStyle.color;

          return (
            <p
              key={idx}
              style={{
                fontSize,
                fontFamily: "Open Sans",
                fontWeight,
                color,
                textAlign: "center",
                whiteSpace: "pre-wrap",
              }}
            >
              {text}
            </p>
          );
        })}
      </div>
    ),
    // Can pass other satori options here: https://github.com/vercel/satori
    {
      width: 800,
      height: aspectRatio === "1:1" ? 800 : 418,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=14400, immutable, no-transform",
      },
    }
  );
}
