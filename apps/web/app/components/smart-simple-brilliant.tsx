import type React from "react";

interface SmartSimpleBrilliantProps {
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
 * Smart · Simple · Brilliant – Issue notification cards for GitBee
 * Shows GitHub issue monitoring notifications in a dark theme
 */
const SmartSimpleBrilliant: React.FC<SmartSimpleBrilliantProps> = ({
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="img"
      aria-label="Issue monitoring notification cards"
    >
      <div
        style={{
          position: "relative",
          width: "295.297px",
          height: "212.272px",
          transform: "scale(1.2)",
        }}
      >
        {/* Right tilted card - New Issues */}
        <div
          style={{
            position: "absolute",
            left: "123.248px",
            top: "0px",
            width: 0,
            height: 0,
          }}
        >
          <div style={{ transform: "rotate(5deg)", transformOrigin: "center" }}>
            <div
              style={{
                width: "155.25px",
                background: "#1a1a1a",
                borderRadius: "9px",
                padding: "6px",
                boxShadow:
                  "0px 0px 0px 1px rgba(255,255,255,0.1), 0px 2px 4px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Bug issue - Red */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(239,68,68,0.15)",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#EF4444" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#FCA5A5",
                      }}
                    >
                      bug
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#FCA5A5",
                      }}
                    >
                      #142
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "9px",
                      color: "#FCA5A5",
                    }}
                  >
                    Memory leak in parser
                  </div>
                </div>
              </div>

              {/* Feature request - Blue */}
              <div
                style={{
                  width: "100%",
                  height: "79.5px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(59,130,246,0.15)",
                  marginTop: "3px",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#3B82F6" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#93C5FD",
                      }}
                    >
                      feature
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#93C5FD",
                      }}
                    >
                      #143
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "9px",
                      color: "#93C5FD",
                    }}
                  >
                    Add dark mode support
                  </div>
                </div>
              </div>

              {/* Enhancement - Green */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(34,197,94,0.15)",
                  marginTop: "3px",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#22C55E" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#86EFAC",
                      }}
                    >
                      good first issue
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "9px",
                      color: "#86EFAC",
                    }}
                  >
                    Update README docs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left card - Slack notifications */}
        <div
          style={{
            position: "absolute",
            left: "0px",
            top: "6.075px",
            width: "155.25px",
          }}
        >
          <div
            style={{ transform: "rotate(-5deg)", transformOrigin: "center" }}
          >
            <div
              style={{
                width: "155.25px",
                background: "#1a1a1a",
                borderRadius: "9px",
                padding: "6px",
                boxShadow:
                  "-8px 6px 11.3px rgba(0,0,0,0.3), 0px 0px 0px 1px rgba(255,255,255,0.1), 0px 2px 4px rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Slack notification - Purple */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(168,85,247,0.15)",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#A855F7" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#D8B4FE",
                      }}
                    >
                      #alerts
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "9px",
                      color: "#D8B4FE",
                    }}
                  >
                    New issue opened
                  </div>
                </div>
              </div>

              {/* Warning notification - Yellow */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(234,179,8,0.15)",
                  display: "flex",
                  marginTop: "3px",
                }}
              >
                <div style={{ width: "2.25px", background: "#eab308" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#fde047",
                      }}
                    >
                      warning
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "9px",
                      color: "#fde047",
                    }}
                  >
                    User warned (2/3)
                  </div>
                </div>
              </div>

              {/* PR closed - Cyan */}
              <div
                style={{
                  width: "100%",
                  height: "79.5px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(6,182,212,0.15)",
                  display: "flex",
                  marginTop: "3px",
                }}
              >
                <div style={{ width: "2.25px", background: "#06B6D4" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "9px",
                        color: "#67E8F9",
                      }}
                    >
                      auto-closed
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "9px",
                      color: "#67E8F9",
                    }}
                  >
                    Spam PR rejected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSimpleBrilliant;
