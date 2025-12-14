import type React from "react";

interface YourWorkInSyncProps {
  /** Fixed width from Figma: 482px */
  width?: number | string;
  /** Fixed height from Figma: 300px */
  height?: number | string;
  /** Optional className to pass to root */
  className?: string;
  /** Theme palette */
  theme?: "light" | "dark";
}

/**
 * Your work, in sync – PR Review conversation UI for GitBee
 * Shows automated PR filtering and moderation in action
 */
const YourWorkInSync: React.FC<YourWorkInSyncProps> = ({
  width = 482,
  height = 300,
  className = "",
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        background: "transparent",
      }}
      role="img"
      aria-label="PR review conversation showing GitBee moderation"
    >
      {/* Root frame size 482×300 – content centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "356px",
          height: "216px",
        }}
      >
        <div
          style={{
            width: "356px",
            height: "216px",
            position: "relative",
            transform: "scale(1.1)",
          }}
        >
          {/* Message 1: GitBee bot message - left */}
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              width: "356px",
              height: "36px",
            }}
          >
            {/* Bot Avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "44px",
                background: "#1a1a1a",
                border: "1px solid #eab308",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/gitbee.png"
                alt="GitBee"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              />
            </div>
            {/* Message bubble */}
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "999px",
                padding: "0px 12px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "16px",
                  letterSpacing: "-0.4px",
                  color: "#fde047",
                  whiteSpace: "nowrap",
                }}
              >
                Checking PR relevance...
              </span>
            </div>
          </div>

          {/* Message 2: Spam PR detected - right */}
          <div
            style={{
              position: "absolute",
              right: "0px",
              top: "60px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              justifyContent: "flex-end",
            }}
          >
            {/* Message bubble */}
            <div
              style={{
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "999px",
                padding: "0px 12px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "16px",
                  letterSpacing: "-0.4px",
                  color: "#FCA5A5",
                  whiteSpace: "nowrap",
                }}
              >
                Spam PR detected
              </span>
            </div>
            {/* Warning icon */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "44px",
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.3)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Message 3: GitBee action - left */}
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "120px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              width: "280px",
              height: "36px",
            }}
          >
            {/* Bot Avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "44px",
                background: "#1a1a1a",
                border: "1px solid #eab308",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/gitbee.png"
                alt="GitBee"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              />
            </div>
            {/* Message bubble */}
            <div
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "999px",
                padding: "0px 12px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "16px",
                  letterSpacing: "-0.4px",
                  color: "#86EFAC",
                  whiteSpace: "nowrap",
                }}
              >
                PR auto-closed with explanation
              </span>
            </div>
          </div>

          {/* Message 4: Status update - center */}
          <div
            style={{
              position: "absolute",
              left: "120px",
              top: "180px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              height: "36px",
            }}
          >
            {/* Message bubble */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "16px",
                padding: "0px 12px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 0px 0px 1px rgba(255,255,255,0.1)",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#e5e5e5",
                  whiteSpace: "nowrap",
                }}
              >
                Community protected
              </span>
            </div>
            {/* Check button */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "44px",
                background: "rgba(34,197,94,0.2)",
                border: "1px solid rgba(34,197,94,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourWorkInSync;
