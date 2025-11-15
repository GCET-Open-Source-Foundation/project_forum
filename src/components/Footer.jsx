export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e5e7eb',
      padding: '16px',
      marginTop: '32px',
      background: '#ffffff'
    }}>
      <div style={{maxWidth: '72rem', margin: '0 auto', textAlign: 'center', fontSize: '.9rem', color: '#6b7280'}}>
        © {new Date().getFullYear()} OSS GCET - All rights reserved.
      </div>
    </footer>
  );
}
