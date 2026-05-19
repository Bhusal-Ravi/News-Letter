
import { Final_Rank_Table } from "../Types/Api_Types";

export function htmlMaker(
  techNews: Final_Rank_Table[],
  worldNews: Final_Rank_Table[],
  email: string
) {

  const allNews = [...worldNews, ...techNews];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncate = (text: string, limit: number = 420) => {
    if (!text) return "";

    if (text.length <= limit) return text;

    return text.slice(0, limit).trim() + "...";
  };

  const renderStory = (story: Final_Rank_Table) => {

    return `

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        background:#ffffff;
        border:1px solid #d1d5db;
        margin-bottom:24px;
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
              height="320"
              style="
                width:100%;
                height:320px;
                object-fit:cover;
                display:block;
              "
            />
          </td>
        </tr>
      `
          : ""
      }

      <tr>
        <td style="padding:28px;">

          <div style="
            font-size:11px;
            font-weight:700;
            letter-spacing:0.08em;
            text-transform:uppercase;
            color:#6b7280;
            margin-bottom:14px;
            font-family:Arial,sans-serif;
          ">
            ${story.category}
          </div>

          <h2 style="
            margin:0 0 16px;
            font-size:30px;
            line-height:1.35;
            color:#111827;
            font-weight:800;
            font-family:Arial,sans-serif;
          ">
            ${story.title}
          </h2>

          <p style="
            margin:0 0 22px;
            font-size:16px;
            line-height:1.8;
            color:#374151;
            font-family:Arial,sans-serif;
          ">
            ${truncate(story.content)}
          </p>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
          >
            <tr>

              <td style="
                font-size:13px;
                color:#6b7280;
                font-family:Arial,sans-serif;
              ">
                ${story.source} · ${formatDate(story.published_date)}
              </td>

              <td align="right">

                ${
                  story.source
                    ? `
                  <a
                    href="${story.source}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                      font-size:13px;
                      font-weight:700;
                      color:#111827;
                      text-decoration:none;
                      font-family:Arial,sans-serif;
                    "
                  >
                    Read More →
                  </a>
                `
                    : ""
                }

              </td>

            </tr>
          </table>

        </td>
      </tr>

    </table>

    `;
  };

  return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>Today's Breaking News</title>

</head>

<body style="
  margin:0;
  padding:40px 18px;
  background:#eceff1;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
      max-width:720px;
      margin:0 auto;
      font-family:Arial,sans-serif;
    "
  >

    <!-- HEADER -->

    <tr>
      <td style="
        padding-bottom:30px;
      ">

        <div style="
          font-size:46px;
          font-weight:900;
          line-height:1.05;
          color:#111827;
          letter-spacing:-0.03em;
          margin-bottom:10px;
        ">
          TODAY'S BREAKING NEWS
        </div>

        <div style="
          font-size:13px;
          color:#6b7280;
          text-transform:uppercase;
          letter-spacing:0.08em;
          font-family:Arial,sans-serif;
        ">
          ${new Date().toDateString()}
        </div>

      </td>
    </tr>

    <!-- NEWS -->

    <tr>
      <td>

        ${allNews.map(renderStory).join("")}

      </td>
    </tr>

    <!-- FOOTER -->

    <tr>
      <td style="
        padding-top:18px;
        border-top:1px solid #d1d5db;
      ">

        <div style="
          font-size:12px;
          line-height:1.9;
          color:#6b7280;
          text-align:center;
          font-family:Arial,sans-serif;
        ">

          You are receiving this email because
          <strong>${email}</strong>
          is subscribed to this newspaper.

          <br/><br/>

          © ${new Date().getFullYear()} Today's Breaking News

        </div>

      </td>
    </tr>

  </table>

</body>

</html>
  `;
}

