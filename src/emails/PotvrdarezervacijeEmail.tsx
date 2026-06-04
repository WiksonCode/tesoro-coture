import type { KorpaArtikl } from '@/types'

interface Props {
  ime: string
  prezime: string
  artikli: KorpaArtikl[]
  datumTermina?: string | null
  napomena?: string | null
}

function formatCijena(rsd: number) {
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 0,
  }).format(rsd)
}

const MJESECI = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar']

function formatDatum(datum: string): string {
  const d = new Date(datum + 'T00:00:00')
  if (isNaN(d.getTime())) return datum
  return `${d.getDate()}. ${MJESECI[d.getMonth()]} ${d.getFullYear()}. godine`
}

export function PotvrdarezervacijeEmail({ ime, prezime, artikli, datumTermina, napomena }: Props) {
  const ukupno = artikli.reduce((sum, a) => sum + a.cijena_rsd, 0)

  const artikliRows = artikli.map((a, i) => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #e8e0d8;vertical-align:top;">
        <span style="display:block;font-size:13px;color:#1a1a1a;font-weight:500;margin-bottom:3px;font-family:Georgia,serif;font-style:italic;">${a.naziv}</span>
        <span style="font-size:11px;color:#8a8a8a;letter-spacing:1px;">${a.boja_naziv}&nbsp;&nbsp;·&nbsp;&nbsp;${a.velicina === 'po_mjeri' ? 'Po meri' : a.velicina}</span>
      </td>
      <td style="padding:16px 0;border-bottom:1px solid #e8e0d8;text-align:right;vertical-align:top;">
        <span style="font-size:13px;color:#1a1a1a;font-weight:600;white-space:nowrap;">${formatCijena(a.cijena_rsd)}</span>
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Potvrda rezervacije — TESORO Couture</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ebe5;-webkit-font-smoothing:antialiased;">

  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0"><tr><td><![endif]-->

  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#f0ebe5;padding:48px 16px 64px;">
    <tr>
      <td align="center">

        <!-- Wrapper -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:580px;">

          <!-- ── TOP BRAND BAR ── -->
          <tr>
            <td style="background-color:#1a1a1a;padding:10px 40px;text-align:center;">
              <span style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;
                font-family:Arial,sans-serif;font-weight:400;">
                TESORO COUTURE
              </span>
            </td>
          </tr>

          <!-- ── HERO ── -->
          <tr>
            <td style="background-color:#1a1a1a;padding:36px 40px 40px;text-align:center;border-bottom:1px solid #2e2e2e;">

              <!-- Gold ornament line -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;">
                <tr>
                  <td style="width:40%;height:1px;background:linear-gradient(to right,transparent,#c9a96e);"></td>
                  <td style="width:10px;padding:0 8px;">
                    <span style="color:#c9a96e;font-size:14px;">◆</span>
                  </td>
                  <td style="width:40%;height:1px;background:linear-gradient(to left,transparent,#c9a96e);"></td>
                </tr>
              </table>

              <h1 style="margin:0;font-size:30px;font-weight:300;font-style:italic;color:#faf7f4;
                font-family:Georgia,'Times New Roman',serif;line-height:1.2;letter-spacing:1px;">
                Rezervacija primljena
              </h1>
              <p style="margin:14px 0 0 0;font-size:12px;color:#c9a96e;letter-spacing:3px;
                text-transform:uppercase;font-family:Arial,sans-serif;">
                Hvala Vam na poverenju
              </p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 0 40px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px 0;font-size:20px;font-weight:300;font-style:italic;color:#1a1a1a;
                font-family:Georgia,'Times New Roman',serif;">
                Poštovana/i ${ime} ${prezime},
              </p>
              <p style="margin:0 0 32px 0;font-size:13px;color:#5a5a5a;line-height:1.8;
                font-family:Arial,sans-serif;">
                Vaša rezervacija je uspešno primljena. Naš tim će Vas kontaktirati
                <strong style="color:#1a1a1a;">u najkraćem roku</strong> radi potvrde termina
                i svih detalja.
              </p>

              <!-- Gold divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="width:32px;height:1px;background-color:#c9a96e;"></td>
                  <td style="height:1px;background-color:#e8e0d8;"></td>
                </tr>
              </table>

              <!-- Section label -->
              <p style="margin:0 0 4px 0;font-size:8px;letter-spacing:4px;text-transform:uppercase;
                color:#c9a96e;font-family:Arial,sans-serif;">
                Rezervisane haljine
              </p>

              <!-- Articles -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  ${artikliRows}
                </tbody>
              </table>

              <!-- Total row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="margin-top:16px;padding-top:16px;border-top:2px solid #1a1a1a;">
                <tr>
                  <td style="font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#8a8a8a;
                    font-family:Arial,sans-serif;vertical-align:middle;">
                    Ukupno
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <span style="font-size:18px;font-weight:600;color:#1a1a1a;
                      font-family:Arial,sans-serif;letter-spacing:0.5px;">
                      ${formatCijena(ukupno)}
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          ${datumTermina || napomena ? `
          <!-- ── INFO BOXES ── -->
          <tr>
            <td style="background-color:#ffffff;padding:28px 40px 0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${datumTermina ? `
                  <td style="background-color:#faf7f4;border:1px solid #e8e0d8;padding:16px 20px;
                    ${napomena ? 'padding-right:10px;' : ''}vertical-align:top;width:${napomena ? '50%' : '100%'};">
                    <p style="margin:0 0 4px 0;font-size:8px;letter-spacing:3px;text-transform:uppercase;
                      color:#c9a96e;font-family:Arial,sans-serif;">Željeni termin</p>
                    <p style="margin:0;font-size:13px;color:#1a1a1a;font-family:Arial,sans-serif;">${formatDatum(datumTermina)}</p>
                  </td>
                  ` : ''}
                  ${napomena ? `
                  ${datumTermina ? '<td style="width:8px;"></td>' : ''}
                  <td style="background-color:#faf7f4;border:1px solid #e8e0d8;padding:16px 20px;vertical-align:top;">
                    <p style="margin:0 0 4px 0;font-size:8px;letter-spacing:3px;text-transform:uppercase;
                      color:#8a8a8a;font-family:Arial,sans-serif;">Napomena</p>
                    <p style="margin:0;font-size:13px;color:#5a5a5a;line-height:1.6;font-family:Arial,sans-serif;">${napomena}</p>
                  </td>
                  ` : ''}
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- ── CONTACT ── -->
          <tr>
            <td style="background-color:#ffffff;padding:28px 40px 40px 40px;">

              <!-- Gold divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td style="width:32px;height:1px;background-color:#c9a96e;"></td>
                  <td style="height:1px;background-color:#e8e0d8;"></td>
                </tr>
              </table>

              <p style="margin:0 0 14px 0;font-size:13px;color:#5a5a5a;line-height:1.7;
                font-family:Arial,sans-serif;">
                Ukoliko imate pitanja, na raspolaganju smo Vam:
              </p>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:24px;font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;">
                    📞 <a href="tel:+38165403 3795" style="color:#c9a96e;text-decoration:none;font-weight:500;">
                      065 403 3795
                    </a>
                  </td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;">
                    📍 Jurija Gagarina 151a, Beograd
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:#1a1a1a;padding:24px 40px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(to right,transparent,#c9a96e33,transparent);"></td>
                </tr>
              </table>
              <p style="margin:0 0 4px 0;font-size:8px;letter-spacing:5px;text-transform:uppercase;
                color:#c9a96e;font-family:Arial,sans-serif;">
                Tesoro Couture
              </p>
              <p style="margin:0;font-size:10px;color:#faf7f4;opacity:0.3;letter-spacing:1px;
                font-family:Arial,sans-serif;">
                Beograd, Srbija
              </p>
            </td>
          </tr>

        </table>
        <!-- /Wrapper -->

      </td>
    </tr>
  </table>

  <!--[if mso]></td></tr></table><![endif]-->

</body>
</html>`
}
