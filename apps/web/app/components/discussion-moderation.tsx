import type React from "react";

interface DiscussionModerationProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Discussion Moderation – GitHub Discussions style UI
 * Shows GitBee helping guide a new contributor through a discussion
 */
const DiscussionModeration: React.FC<DiscussionModerationProps> = ({
  width = 400,
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "#0d1117",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        {/* Discussion Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Discussion icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#8b949e">
            <path d="M1.5 2.75a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25v5.5a.25.25 0 0 1-.25.25h-3.5a.75.75 0 0 0-.53.22L3.5 11.44V9.25a.75.75 0 0 0-.75-.75h-1a.25.25 0 0 1-.25-.25Zm.25-1.75A1.75 1.75 0 0 0 0 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.458 1.458 0 0 0 2.487 1.03L7.061 10h3.189A1.75 1.75 0 0 0 12 8.25v-5.5A1.75 1.75 0 0 0 10.25 1ZM14.5 4.75a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z" />
          </svg>
          <span
            style={{
              color: "#e6edf3",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Q&A
          </span>
          <span
            style={{
              color: "#8b949e",
              fontSize: "12px",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            #help
          </span>
        </div>

        {/* Discussion Title */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              color: "#e6edf3",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              marginBottom: "4px",
            }}
          >
            How do I set up the dev environment?
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                background: "#238636",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: 500,
                padding: "2px 6px",
                borderRadius: "12px",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Answered
            </span>
            <span
              style={{
                color: "#8b949e",
                fontSize: "11px",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              opened 2h ago by
            </span>
            <span
              style={{
                color: "#e6edf3",
                fontSize: "11px",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              @newcontributor
            </span>
          </div>
        </div>

        {/* Original Question */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {/* User avatar - GitHub default style */}
            <img
              src="https://avatars.githubusercontent.com/u/234783096?v=4"
              alt="User avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    color: "#e6edf3",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  newcontributor
                </span>
                <span
                  style={{
                    color: "#8b949e",
                    fontSize: "11px",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  2h ago
                </span>
              </div>
              <div
                style={{
                  color: "#c9d1d9",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Hi! I'm new to this project and trying to set up the dev
                environment. The README mentions Docker but I'm getting errors.
                Can someone help?
              </div>
            </div>
          </div>
        </div>

        {/* GitBee Response */}
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(35, 134, 54, 0.08)",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {/* GitBee avatar */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#1a1a1a",
                border: "2px solid #eab308",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="/gitbee.png"
                alt="GitBee"
                style={{ width: "22px", height: "22px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    color: "#e6edf3",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  gitbee
                </span>
                <span
                  style={{
                    background: "#238636",
                    color: "#ffffff",
                    fontSize: "9px",
                    fontWeight: 500,
                    padding: "1px 5px",
                    borderRadius: "4px",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  BOT
                </span>
                <span
                  style={{
                    color: "#8b949e",
                    fontSize: "11px",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  1h ago
                </span>
              </div>
              <div
                style={{
                  color: "#c9d1d9",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Welcome! For Docker setup issues, check out our{" "}
                <span style={{ color: "#58a6ff" }}>CONTRIBUTING.md</span> guide.
                Make sure you have Docker 20.10+ installed.
              </div>
              {/* Reaction buttons */}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(46, 160, 67, 0.15)",
                    border: "1px solid rgba(46, 160, 67, 0.4)",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "11px",
                  }}
                >
                  <span>👍</span>
                  <span style={{ color: "#8b949e" }}>3</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "11px",
                  }}
                >
                  <span>🎉</span>
                  <span style={{ color: "#8b949e" }}>1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marked as answer indicator */}
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(35, 134, 54, 0.15)",
            borderTop: "1px solid rgba(35, 134, 54, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="#238636">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
          <span
            style={{
              color: "#3fb950",
              fontSize: "11px",
              fontWeight: 500,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Marked as answer by @newcontributor
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscussionModeration;
