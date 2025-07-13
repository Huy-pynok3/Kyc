export default function FloatingMascots() {
    return (
      <>
        <img
          alt="orange yeti"
          width={154}
          height={158}
          src="https://msu.io/_next/image?url=%2Fimages%2Fmain%2Fsection_c%2Forange.png&w=256&q=75"
          className="absolute bottom-40 right-40 animate-bounce"
          style={{ zIndex: 10 }}
         />
        <img
          alt="pink bean"
          width={154}
          height={158}
          src="https://msu.io/_next/image?url=%2Fimages%2Fmain%2Fsection_c%2Fpinkbean.png&w=256&q=75"
          className="absolute top-50 left-50 animate-spin"
          style={{ zIndex: 10 }}
        />
      </>
    );
  }
  