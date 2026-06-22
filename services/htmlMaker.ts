import { Final_Rank_Table } from "../Types/Api_Types";

export function htmlMaker(
  techNews: Final_Rank_Table[],
  worldNews: Final_Rank_Table[],
  email: string,
  unsubscribeLink: string
) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const truncate = (text: string) => text || "";

  // Site fonts: JetBrains Mono (labels/meta), Libre Caslon Text (headings).
  // Both pulled in via @import below; most clients fall back to the
  // monospace / serif stacks, which is fine — it's the same fallback
  // behavior the site itself relies on.
  const MONO = "'JetBrains Mono', 'Courier New', monospace";
  const SERIF = "'Libre Caslon Text', Georgia, 'Times New Roman', serif";

  const renderStory = (story: Final_Rank_Table) => `
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="margin-bottom:48px;"
    >
      ${
        story.image_url
          ? `
      <tr>
        <td style="position:relative;">
          <!--[if !mso]><!-->
          <div style="position:relative;">
            <img
              src="${story.image_url}"
              alt="${story.title}"
              width="640"
              class="story-img"
              style="
                width:100%;
                height:260px;
                object-fit:cover;
                display:block;
                background:#efeeec;
              "
            />
            <span
              style="
                position:absolute;
                top:14px;
                left:14px;
                background:#000000;
                color:#ffffff;
                padding:5px 10px;
                font-size:10px;
                font-weight:700;
                letter-spacing:0.15em;
                text-transform:uppercase;
                font-family:${MONO};
              "
            >
              ${story.category || "GENERAL"}
            </span>
          </div>
          <!--<![endif]-->
        </td>
      </tr>`
          : ""
      }

      <tr>
        <td class="story-cell" style="padding:20px 0 0;">
          <div
            class="story-date"
            style="
              font-size:10px;
              letter-spacing:0.15em;
              text-transform:uppercase;
              color:#695d4a;
              margin-bottom:12px;
              font-family:${MONO};
              font-weight:700;
            "
          >
            ${formatDate(story.published_date)}
          </div>

          <h2
            class="story-title"
            style="
              margin:0 0 12px;
              font-size:24px;
              line-height:1.25;
              color:#1a1c1b;
              font-weight:700;
              font-style:italic;
              font-family:${SERIF};
            "
          >
            ${story.title}
          </h2>

          <p
            class="story-body"
            style="
              margin:0;
              font-size:13px;
              line-height:1.7;
              letter-spacing:0.01em;
              color:#695d4a;
              font-family:Arial,sans-serif;
            "
          >
            ${truncate(story.content)}
          </p>

          ${
            story.redirect_url
              ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid rgba(207,196,197,0.4);">
            <tr>
              <td style="padding-top:16px;">
                
                  href="${story.redirect_url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    display:inline-block;
                    color:#000000;
                    text-decoration:none;
                    border-bottom:1px solid rgba(0,0,0,0.25);
                    padding-bottom:3px;
                    font-size:10px;
                    font-weight:700;
                    letter-spacing:0.15em;
                    text-transform:uppercase;
                    font-family:${MONO};
                  "
                >
                  Continue Reading &#8594;
                </a>
              </td>
            </tr>
          </table>`
              : ""
          }
        </td>
      </tr>
    </table>
  `;

  const sectionHeader = (label: string) => `
    <tr>
      <td style="padding:0 0 6px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td
              style="
                background:#000000;
                color:#ffffff;
                padding:7px 14px;
                font-size:10px;
                letter-spacing:0.2em;
                text-transform:uppercase;
                font-weight:700;
                font-family:${MONO};
              "
            >
              ${label}
            </td>
            <td style="border-bottom:1px solid rgba(207,196,197,0.5);"></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td height="28"></td></tr>
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Morning Brief</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400;1,700&display=swap');

    @media only screen and (max-width: 600px) {
      .hero-title {
        font-size: 30px !important;
        line-height: 1.15 !important;
      }
      .hero-sub {
        font-size: 14px !important;
        line-height: 1.7 !important;
        margin-top: 14px !important;
      }
      .hero-td {
        padding: 32px 16px 40px !important;
      }
      .story-img {
        height: 180px !important;
      }
      .story-title {
        font-size: 20px !important;
      }
      .story-body {
        font-size: 13px !important;
      }
      .footer-cell {
        padding: 24px 18px !important;
      }
    }
  </style>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#faf9f7;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background:#faf9f7;padding:0 16px 80px;"
  >
    <tr>
      <td align="center">

        <!-- Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:680px;
            font-family:Arial,sans-serif;
          "
        >

          <!-- HERO -->
          <tr>
            <td
              class="hero-td"
              style="
                padding:44px 0 48px;
                border-bottom:1px solid rgba(207,196,197,0.5);
              "
            >
              <div
                style="
                  font-size:10px;
                  font-weight:700;
                  letter-spacing:0.25em;
                  text-transform:uppercase;
                  color:#695d4a;
                  font-family:${MONO};
                  margin-bottom:14px;
                "
              >
                Newsletter &mdash; Delivered at 6:00 AM &middot; NPT
              </div>

              <div
                class="hero-title"
                style="
                  font-size:42px;
                  line-height:1.08;
                  font-weight:700;
                  font-style:italic;
                  color:#000000;
                  font-family:${SERIF};
                "
              >
                Your morning clarity, delivered.
              </div>

              <div
                class="hero-sub"
                style="
                  max-width:520px;
                  margin-top:18px;
                  font-size:14px;
                  line-height:1.8;
                  color:#695d4a;
                  font-family:Arial,sans-serif;
                "
              >
                Fresh, curated reporting from around the world — designed to give you signal over noise before your day begins.
              </div>

              <div
                style="
                  margin-top:18px;
                  font-size:10px;
                  color:#7e7576;
                  letter-spacing:0.15em;
                  text-transform:uppercase;
                  font-weight:700;
                  font-family:${MONO};
                "
              >
                ${new Date().toDateString()}
              </div>
            </td>
          </tr>

          <tr><td height="44"></td></tr>

          <!-- WORLD NEWS -->
          ${sectionHeader("World News")}

          <tr>
            <td>
              ${worldNews.map(renderStory).join("")}
            </td>
          </tr>

          <tr><td height="16"></td></tr>

          <!-- TECH NEWS -->
          ${sectionHeader("Tech &amp; Science")}

          <tr>
            <td>
              ${techNews.map(renderStory).join("")}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding-top:8px;border-top:1px solid rgba(207,196,197,0.5);">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
              >
                <tr>
                  <td
                    class="footer-cell"
                    style="
                      padding:34px 0;
                      text-align:center;
                    "
                  >
                    <div
                      style="
                        font-size:10px;
                        letter-spacing:0.2em;
                        text-transform:uppercase;
                        color:#695d4a;
                        margin-bottom:14px;
                        font-family:${MONO};
                        font-weight:700;
                      "
                    >
                      Daily Morning Brief
                    </div>

                    <p
                      style="
                        margin:0;
                        font-size:13px;
                        line-height:2;
                        color:#695d4a;
                        font-family:Arial,sans-serif;
                      "
                    >
                      You are receiving this because
                      <span style="color:#000000;font-weight:700;">${email}</span>
                      subscribed to this newsletter.
                    </p>

                    <div style="margin-top:20px;">
                      
                        href="${unsubscribeLink}"
                        style="
                          display:inline-block;
                          color:#000000;
                          text-decoration:none;
                          font-size:10px;
                          font-weight:700;
                          letter-spacing:0.15em;
                          text-transform:uppercase;
                          border-bottom:1px solid #000000;
                          padding-bottom:3px;
                          font-family:${MONO};
                        "
                      >
                        Unsubscribe
                      </a>
                    </div>

                    <div
                      style="
                        margin-top:20px;
                        font-size:10px;
                        color:#7e7576;
                        letter-spacing:0.1em;
                        text-transform:uppercase;
                        font-family:${MONO};
                      "
                    >
                      &copy; ${new Date().getFullYear()} Morning Brief
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
}