
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

  const renderStory = (story: Final_Rank_Table) => `
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        background:#ffffff;
        border:1px solid rgba(0,0,0,0.06);
        border-radius:18px;
        overflow:hidden;
        margin-bottom:28px;
      "
    >
      ${
        story.image_url
          ? `
      <tr>
        <td>
          <img
            src="${story.image_url}"
            alt="${story.title}"
            width="680"
            style="
              width:100%;
              height:260px;
              object-fit:cover;
              display:block;
            "
          />
        </td>
      </tr>`
          : ""
      }

      <tr>
        <td style="padding:34px 36px;">
          <div
            style="
              font-size:11px;
              letter-spacing:0.16em;
              text-transform:uppercase;
              color:#6b7280;
              margin-bottom:18px;
              font-family:Arial,sans-serif;
              font-weight:700;
            "
          >
            ${formatDate(story.published_date)}
          </div>

          <h2
            style="
              margin:0 0 18px;
              font-size:34px;
              line-height:1.15;
              color:#111827;
              font-weight:700;
              letter-spacing:-0.03em;
              font-family:Georgia,'Times New Roman',serif;
            "
          >
            ${story.title}
          </h2>

          <p
            style="
              margin:0;
              font-size:16px;
              line-height:1.9;
              color:#4b5563;
              font-family:Arial,sans-serif;
            "
          >
            ${truncate(story.content)}
          </p>

          ${
            story.redirect_url
              ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
            <tr>
              <td>
                <a
                  href="${story.redirect_url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    display:inline-block;
                    background:#111111;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:11px;
                    font-weight:700;
                    letter-spacing:0.14em;
                    text-transform:uppercase;
                    padding:14px 22px;
                    border-radius:999px;
                    font-family:Arial,sans-serif;
                  "
                >
                  Read Full Story →
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

  const sectionHeader = (label: string, iconHex: string) => `
    <tr>
      <td style="padding:0 0 26px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td
              style="
                background:#111111;
                color:#ffffff;
                padding:10px 18px;
                border-radius:999px;
                font-size:11px;
                letter-spacing:0.16em;
                text-transform:uppercase;
                font-weight:700;
                font-family:Arial,sans-serif;
              "
            >
              ${iconHex}&nbsp;&nbsp;${label}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Morning Brief</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#faf9f8;
  "
>
  <!-- Background Gradient -->
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
      background:linear-gradient(
        to bottom,
        #e3dac9 0%,
        #f0e6d2 22%,
        #faf9f8 60%
      );
      padding:48px 16px 80px;
    "
  >
    <tr>
      <td align="center">

        <!-- Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:720px;
            font-family:Arial,sans-serif;
          "
        >

          <!-- HERO -->
          <tr>
            <td style="padding:20px 12px 56px;text-align:center;">

              <!-- Badge -->
              <div
                style="
                  display:inline-block;
                  background:#111111;
                  color:#ffffff;
                  padding:10px 18px;
                  border-radius:999px;
                  font-size:11px;
                  font-weight:700;
                  letter-spacing:0.16em;
                  text-transform:uppercase;
                  font-family:Arial,sans-serif;
                  margin-bottom:34px;
                "
              >
                Delivered at 6:00 AM · NPT
              </div>

              <!-- Title -->
              <div
                style="
                  font-size:62px;
                  line-height:1.02;
                  font-weight:700;
                  letter-spacing:-0.05em;
                  color:#111827;
                  font-family:Georgia,'Times New Roman',serif;
                "
              >
                Your morning<br />
                clarity, delivered.
              </div>

              <!-- Subtitle -->
              <div
                style="
                  max-width:560px;
                  margin:28px auto 0;
                  font-size:17px;
                  line-height:1.9;
                  color:#4b5563;
                  font-family:Arial,sans-serif;
                "
              >
                Fresh, curated reporting from around the world —
                designed to give you signal over noise before your day begins.
              </div>

              <!-- Date -->
              <div
                style="
                  margin-top:28px;
                  font-size:11px;
                  color:#6b7280;
                  letter-spacing:0.16em;
                  text-transform:uppercase;
                  font-weight:700;
                  font-family:Arial,sans-serif;
                "
              >
                ${new Date().toDateString()}
              </div>

            </td>
          </tr>

          <!-- WORLD NEWS -->
          ${sectionHeader("World News", "&#127758;")}

          <tr>
            <td>
              ${worldNews.map(renderStory).join("")}
            </td>
          </tr>

          <!-- SPACING -->
          <tr>
            <td height="28"></td>
          </tr>

          <!-- TECH NEWS -->
          ${sectionHeader("Tech &amp; Science", "&#128187;")}

          <tr>
            <td>
              ${techNews.map(renderStory).join("")}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding-top:36px;">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#ffffff;
                  border:1px solid rgba(0,0,0,0.06);
                  border-radius:18px;
                "
              >
                <tr>
                  <td
                    style="
                      padding:34px 36px;
                      text-align:center;
                    "
                  >
                    <div
                      style="
                        font-size:11px;
                        letter-spacing:0.14em;
                        text-transform:uppercase;
                        color:#6b7280;
                        margin-bottom:18px;
                        font-family:Arial,sans-serif;
                        font-weight:700;
                      "
                    >
                      Daily Morning Brief
                    </div>

                    <p
                      style="
                        margin:0;
                        font-size:14px;
                        line-height:2;
                        color:#4b5563;
                        font-family:Arial,sans-serif;
                      "
                    >
                      You are receiving this because
                      <span style="color:#111827;font-weight:700;">
                        ${email}
                      </span>
                      subscribed to this newsletter.
                    </p>

                    <div style="margin-top:26px;">
                      <a
                        href="${unsubscribeLink}"
                        style="
                          display:inline-block;
                          color:#111111;
                          text-decoration:none;
                          font-size:11px;
                          font-weight:700;
                          letter-spacing:0.14em;
                          text-transform:uppercase;
                          border-bottom:1px solid #111111;
                          padding-bottom:3px;
                          font-family:Arial,sans-serif;
                        "
                      >
                        Unsubscribe
                      </a>
                    </div>

                    <div
                      style="
                        margin-top:24px;
                        font-size:11px;
                        color:#9ca3af;
                        letter-spacing:0.08em;
                        text-transform:uppercase;
                        font-family:Arial,sans-serif;
                      "
                    >
                      © ${new Date().getFullYear()} Morning Brief
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

