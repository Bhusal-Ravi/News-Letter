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
    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:#ffffff;border-bottom:1px solid #e5e7eb;">
      ${
        story.image_url
          ? `
      <tr>
        <td>
          <img src="${story.image_url}" alt="${story.title}"
            width="680" height="240"
            style="width:100%;height:240px;object-fit:cover;display:block;" />
        </td>
      </tr>`
          : ""
      }
      <tr>
        <td style="padding:28px 36px;">
          <h2 style="
            margin:0 0 14px;
            font-size:24px;
            line-height:1.3;
            color:#111827;
            font-weight:700;
            font-family:Georgia,'Times New Roman',serif;
          ">
            ${story.title}
          </h2>
          <p style="
            margin:0 0 20px;
            font-size:15px;
            line-height:1.85;
            color:#374151;
            font-family:Arial,sans-serif;
          ">
            ${truncate(story.content)}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="
                font-size:11px;
                color:#6b7280;
                letter-spacing:0.06em;
                text-transform:uppercase;
                font-family:Arial,sans-serif;
              ">
                ${formatDate(story.published_date)}
              </td>
              ${
                story.redirect_url
                  ? `
              <td align="right">
                <a href="${story.redirect_url}" target="_blank" rel="noopener noreferrer"
                  style="
                    font-size:11px;
                    font-weight:700;
                    color:#111827;
                    text-decoration:none;
                    letter-spacing:0.08em;
                    text-transform:uppercase;
                    font-family:Arial,sans-serif;
                  ">
                  Read full story &#8594;
                </a>
              </td>`
                  : ""
              }
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const sectionHeader = (label: string, iconHex: string) => `
    <tr>
      <td style="background:#ffffff;padding:28px 36px 0;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="
              border-bottom:2px solid #111827;
              padding-bottom:8px;
            ">
              <span style="
                font-size:11px;
                font-weight:700;
                color:#111827;
                letter-spacing:0.18em;
                text-transform:uppercase;
                font-family:Arial,sans-serif;
              ">
                ${iconHex}&nbsp;&nbsp;${label}
              </span>
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
  <title>Today's Breaking News</title>
</head>
<body style="margin:0;padding:32px 16px;background:#ffffff;">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="max-width:680px;margin:0 auto;font-family:Arial,sans-serif;">

    <!-- HEADER -->
    <tr>
      <td style="background:#ffffff;padding:40px 36px 32px;border-bottom:1px solid #e5e7eb;">
        <div style="
          font-size:10px;
          color:#6b7280;
          letter-spacing:0.2em;
          text-transform:uppercase;
          font-family:Arial,sans-serif;
          margin-bottom:14px;
        ">
          Your daily briefing
        </div>
        <div style="
          font-size:44px;
          font-weight:900;
          color:#111827;
          line-height:1.0;
          letter-spacing:-0.02em;
          font-family:Georgia,'Times New Roman',serif;
        ">
          Today's <span style="color:#111827;">Breaking</span> News
        </div>
        <div style="
          font-size:11px;
          color:#6b7280;
          margin-top:14px;
          letter-spacing:0.12em;
          text-transform:uppercase;
          font-family:Arial,sans-serif;
        ">
          ${new Date().toDateString()}
        </div>
      </td>
    </tr>

    <!-- GOLD RULE -->
    <tr>
      <td style="height:1px;background:#e5e7eb;"></td>
    </tr>

    <!-- WORLD NEWS -->
    ${sectionHeader("World News", "&#127758;")}
    <tr>
      <td>${worldNews.map(renderStory).join("")}</td>
    </tr>

    <!-- SECTION GAP -->
    <tr>
      <td style="height:2px;background:#f3f4f6;"></td>
    </tr>

    <!-- TECH NEWS -->
    ${sectionHeader("Tech &amp; Science", "&#128187;")}
    <tr>
      <td>${techNews.map(renderStory).join("")}</td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="
        background:#ffffff;
        padding:28px 36px;
        border-top:1px solid #e5e7eb;
        text-align:center;
      ">
        <p style="
          font-size:11px;
          color:#6b7280;
          line-height:2;
          margin:0;
          font-family:Arial,sans-serif;
        ">
          You are receiving this because
          <span style="color:#111827;">${email}</span>
          is subscribed to this newsletter.<br/><br/>
          <a href="${unsubscribeLink}"
            style="color:#111827;text-decoration:none;font-weight:700;">
            Unsubscribe
          </a>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          &copy; ${new Date().getFullYear()} Today's Breaking News
        </p>
      </td>
    </tr>

  </table>
</body>
</html>
  `;
}