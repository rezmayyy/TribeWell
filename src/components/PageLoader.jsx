function PageLoader() {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '4rem',
        height: '4rem',
        borderRadius: '50%',
        border: '0.4rem solid transparent',
        borderTop: '0.4rem solid',
        borderTopColor: '#F4A623',
        background: 'conic-gradient(#F4A623, #5954A6)',
        maskImage: 'radial-gradient(farthest-side, transparent 80%, black 81%)',
        WebkitMaskImage: 'radial-gradient(farthest-side, transparent 80%, black 81%)',
        animation: 'spin 1s linear infinite',
      }} />

      <h2 style={{
        marginTop: '1rem',
        background: 'linear-gradient(92.06deg, #F4A623 19.66%, #5954A6 80.36%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
      }}>
        TribeWell is Loading...
      </h2>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PageLoader;
