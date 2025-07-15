export default function FloatingMascots({hidden = false}) {

    if (hidden) return null;
    
    return (
        <>
            <img
                alt="yeti"
                width={154}
                height={158}
                src="https://msu.io/_next/image?url=%2Fimages%2Fmain%2Fsection_c%2Forange.png&w=256&q=75"
                className="absolute z-10 animate-bounce
                    w-[90px] h-[90px]
                    sm:w-[100px] sm:h-[100px]
                    md:w-[154px] md:h-[158px]
                    right-[7%] bottom-[12%] sm:right-[10%] sm:bottom-[10%] md:right-1/6 md:bottom-1/7"
            />
            <img
                alt="yeti"
                width={154}
                height={158}
                src="https://msu.io/_next/image?url=%2Fimages%2Fmain%2Fsection_c%2Fpinkbean.png&w=256&q=75"
                className="absolute z-10 animate-spin
                    w-[90px] h-[90px]
                    sm:w-[100px] sm:h-[100px]
                    md:w-[154px] md:h-[158px]
                    top-[14%] left-[2%] sm:top-[18%] sm:left-[10%] md:top-1/7 md:left-1/6"
            />
        </>
    );
}
// animate-bounce, animate-ping, animate-pulse, animate-spin.
