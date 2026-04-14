import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Willkommen zur Fullstack Challenge!</h1>

      <p>
        In dieser Challenge baust du eine einfache Buchverwaltungs-App mit Next.js und einer
        PostgreSQL-Datenbank. Die Grundstruktur ist bereits vorhanden – deine Aufgabe ist es, das
        Book-Feature vollständig zu implementieren.
      </p>

      <h2>Deine Aufgaben</h2>
      <ol>
        <li>
          <strong>Datenbank-Migration</strong> — Book Model in der Drizzle-Schema-Datei erstellen
          und die Datenbank migrieren
        </li>
        <li>
          <strong>API-Endpunkte</strong> — Routes für Bücher implementieren (GET, POST, PUT, DELETE)
        </li>
        <li>
          <strong>Frontend</strong> — Bücher-Seite bauen, die Bücher anzeigt und neue Bücher
          hinzufügen lässt
        </li>
      </ol>

      <h2>Nützliche Links</h2>
      <ul>
        <li>
          <Link href="/books">Bücher-Seite</Link> — Hier kommt deine Implementierung hin
        </li>
        <li>
          <Link href="/api-doc">API Dokumentation</Link> — Alle Endpunkte mit Beispielen
        </li>
        <li>
          <a
            href="https://github.com/innFactory/fullstack-challenge"
            target="_blank"
            rel="noreferrer"
          >
            README
          </a>{" "}
          — Aufgabenbeschreibung und weitere Details
        </li>
      </ul>

      <h2>Referenz-Implementierung</h2>
      <p>
        Schau dir <code>packages/web/src/app/api/authors/route.ts</code> an – das ist das Muster,
        das du für die Bücher-Endpunkte verwenden sollst.
      </p>
    </div>
  );
}
