import dayjs from "dayjs";

import type { Booking } from "../types/booking";

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function printBookingReceipt(booking: Booking) {
  const popup = window.open("", "_blank", "width=850,height=900");

  if (!popup) {
    return;
  }

  const payments = booking.payments
    .map(
      (payment) => `
          <tr>
            <td>
              ${dayjs(payment.paid_at).format("DD/MM/YYYY HH:mm")}
            </td>

            <td>
              ${escapeHtml(payment.payment_type)}
            </td>

            <td>
              ${escapeHtml(payment.payment_method)}
            </td>

            <td class="right">
              ${currency(payment.amount)}
            </td>
          </tr>
        `,
    )
    .join("");

  popup.document.write(`
    <!doctype html>

    <html lang="es">
      <head>
        <meta charset="UTF-8" />

        <title>
          ${escapeHtml(booking.folio)}
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 40px;
            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #17202a;
          }

          .receipt {
            max-width: 760px;
            margin: auto;
          }

          .header {
            display: flex;
            justify-content:
              space-between;
            align-items:
              flex-start;

            border-bottom:
              3px solid #173b57;

            padding-bottom: 22px;
          }

          .business {
            font-size: 24px;
            font-weight: 700;
            color: #173b57;
          }

          .subtitle {
            margin-top: 4px;
            color: #667085;
            font-size: 12px;
          }

          .folio {
            text-align: right;
            font-size: 12px;
          }

          .folio strong {
            display: block;
            margin-top: 4px;
            font-size: 16px;
          }

          .section {
            margin-top: 28px;
          }

          h2 {
            font-size: 13px;
            text-transform:
              uppercase;

            letter-spacing: .7px;

            color: #667085;

            margin: 0 0 12px;
          }

          .grid {
            display: grid;
            grid-template-columns:
              1fr 1fr;

            gap: 14px 35px;
          }

          .label {
            font-size: 11px;
            color: #667085;
          }

          .value {
            margin-top: 3px;
            font-size: 14px;
            font-weight: 600;
          }

          .financial {
            margin-top: 30px;
            padding: 20px;
            border-radius: 12px;
            background: #f6f8fa;
          }

          .row {
            display: flex;
            justify-content:
              space-between;

            padding: 6px 0;
          }

          .total {
            margin-top: 8px;
            padding-top: 12px;
            border-top:
              1px solid #dfe3e8;

            font-size: 17px;
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse:
              collapse;

            margin-top: 10px;
          }

          th,
          td {
            padding: 10px 8px;
            border-bottom:
              1px solid #e7eaee;

            font-size: 11px;
            text-align: left;
          }

          th {
            color: #667085;
          }

          .right {
            text-align: right;
          }

          .footer {
            margin-top: 40px;
            padding-top: 18px;

            border-top:
              1px solid #e7eaee;

            color: #667085;
            font-size: 10px;
            text-align: center;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">

          <div class="header">
            <div>
              <div class="business">
                Villa Imperial
              </div>

              <div class="subtitle">
                Comprobante de reservación
              </div>
            </div>

            <div class="folio">
              Folio

              <strong>
                ${escapeHtml(booking.folio)}
              </strong>
            </div>
          </div>


          <div class="section">
            <h2>
              Información del evento
            </h2>

            <div class="grid">
              <div>
                <div class="label">
                  Cliente
                </div>

                <div class="value">
                  ${escapeHtml(booking.client.full_name)}
                </div>
              </div>

              <div>
                <div class="label">
                  Teléfono
                </div>

                <div class="value">
                  ${escapeHtml(booking.client.phone)}
                </div>
              </div>

              <div>
                <div class="label">
                  Evento
                </div>

                <div class="value">
                  ${escapeHtml(booking.event_type)}
                </div>
              </div>

              <div>
                <div class="label">
                  Fecha
                </div>

                <div class="value">
                  ${dayjs(booking.starts_at).format("DD/MM/YYYY")}
                </div>
              </div>

              <div>
                <div class="label">
                  Horario
                </div>

                <div class="value">
                  ${dayjs(booking.starts_at).format("h:mm A")}
                  -
                  ${dayjs(booking.ends_at).format("h:mm A")}
                </div>
              </div>

              <div>
                <div class="label">
                  Paquete
                </div>

                <div class="value">
                  ${escapeHtml(booking.package_name_snapshot)}
                </div>
              </div>
            </div>
          </div>


          <div class="financial">
            <div class="row">
              <span>
                Precio
              </span>

              <strong>
                ${currency(booking.agreed_price)}
              </strong>
            </div>

            <div class="row">
              <span>
                Descuento
              </span>

              <strong>
                ${currency(booking.discount)}
              </strong>
            </div>

            <div class="row total">
              <span>
                Total
              </span>

              <span>
                ${currency(booking.final_price)}
              </span>
            </div>

            <div class="row">
              <span>
                Pagado
              </span>

              <strong>
                ${currency(booking.total_paid)}
              </strong>
            </div>

            <div class="row">
              <span>
                Saldo pendiente
              </span>

              <strong>
                ${currency(booking.balance)}
              </strong>
            </div>
          </div>


          ${
            booking.payments.length
              ? `
                <div class="section">
                  <h2>
                    Historial de pagos
                  </h2>

                  <table>
                    <thead>
                      <tr>
                        <th>
                          Fecha
                        </th>

                        <th>
                          Tipo
                        </th>

                        <th>
                          Forma
                        </th>

                        <th class="right">
                          Importe
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      ${payments}
                    </tbody>
                  </table>
                </div>
              `
              : ""
          }


          <div class="footer">
            Comprobante informativo generado
            por el sistema de administración
            de Villa Imperial.
          </div>
        </div>

        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  popup.document.close();
}
