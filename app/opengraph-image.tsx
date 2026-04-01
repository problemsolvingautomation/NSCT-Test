import { ImageResponse } from "next/og";

export const alt = "NSCT Prep — Free MCQ Practice for NSCT Test Preparation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0D9488 0%, #0F766E 50%, #065F56 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "white",
              fontWeight: 700,
            }}
          >
            N
          </div>
          <span
            style={{
              fontSize: "42px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            NSCT Prep
          </span>
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "24px",
            display: "flex",
          }}
        >
          Master Your NSCT Test
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            marginBottom: "40px",
            display: "flex",
          }}
        >
          {`4,470+ MCQs · 10 Subjects · 140+ Topics · Free`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "32px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 700, color: "white" }}>4,470+</span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>Verified MCQs</span>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 700, color: "white" }}>10</span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>CS Subjects</span>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "16px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "32px", fontWeight: 700, color: "white" }}>3</span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>Difficulty Levels</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
