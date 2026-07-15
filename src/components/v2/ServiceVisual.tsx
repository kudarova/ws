type ServiceVisualProps = {
  id: string;
};

function ServiceVisual({ id }: ServiceVisualProps) {
  const scene = (() => {
    switch (id) {
      case "mobile-apps":
        return (
          <>
            <rect className="v2-service-scene__surface" x="112" y="30" width="118" height="184" rx="25" />
            <rect className="v2-service-scene__surface-strong" x="210" y="52" width="118" height="162" rx="25" />
            <line className="v2-service-scene__muted" x1="151" y1="48" x2="190" y2="48" />
            <line className="v2-service-scene__muted" x1="249" y1="70" x2="288" y2="70" />
            <rect className="v2-service-scene__signal-fill v2-service-scene__float" x="132" y="78" width="78" height="53" rx="14" />
            <rect className="v2-service-scene__line" x="230" y="98" width="78" height="72" rx="14" />
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M248 151l17-18 13 9 18-25" />
            <circle className="v2-service-scene__signal-fill" cx="171" cy="184" r="8" />
            <circle className="v2-service-scene__surface" cx="269" cy="190" r="8" />
          </>
        );
      case "automation":
        return (
          <>
            <path className="v2-service-scene__muted" d="M46 121H394" />
            {[64, 168, 272, 376].map((x, index) => (
              <g key={x} className={`v2-service-scene__step v2-service-scene__step--${index + 1}`}>
                <rect className={index === 2 ? "v2-service-scene__surface-strong" : "v2-service-scene__surface"} x={x - 31} y="88" width="62" height="66" rx="18" />
                <circle className={index === 2 ? "v2-service-scene__signal-fill" : "v2-service-scene__line"} cx={x} cy="121" r="8" />
              </g>
            ))}
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M95 121h42m62 0h42m62 0h42" />
            <path className="v2-service-scene__signal" d="m129 113 8 8-8 8m104-16 8 8-8 8m104-16 8 8-8 8" />
          </>
        );
      case "ai-solutions":
        return (
          <>
            <rect className="v2-service-scene__surface" x="40" y="62" width="112" height="132" rx="16" />
            <rect className="v2-service-scene__surface" x="57" y="45" width="112" height="132" rx="16" />
            <path className="v2-service-scene__muted" d="M78 81h64M78 103h48M78 125h57" />
            <circle className="v2-service-scene__surface-strong v2-service-scene__pulse" cx="230" cy="120" r="47" />
            <path className="v2-service-scene__signal v2-service-scene__rotate" d="M230 88v64M198 120h64M208 98l44 44M252 98l-44 44" />
            <rect className="v2-service-scene__surface" x="309" y="66" width="91" height="108" rx="18" />
            <path className="v2-service-scene__muted" d="M330 96h49M330 120h37M330 144h45" />
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M169 120h14m94 0h32" />
          </>
        );
      case "integrations":
        return (
          <>
            <rect className="v2-service-scene__surface" x="25" y="42" width="96" height="54" rx="16" />
            <rect className="v2-service-scene__surface" x="25" y="144" width="96" height="54" rx="16" />
            <rect className="v2-service-scene__surface" x="319" y="42" width="96" height="54" rx="16" />
            <rect className="v2-service-scene__surface" x="319" y="144" width="96" height="54" rx="16" />
            <rect className="v2-service-scene__surface-strong" x="174" y="76" width="92" height="88" rx="26" />
            <circle className="v2-service-scene__signal-fill v2-service-scene__pulse" cx="220" cy="120" r="13" />
            <path className="v2-service-scene__line" d="M121 69h36l17 30M121 171h36l17-30M266 99l17-30h36M266 141l17 30h36" />
            <circle className="v2-service-scene__signal v2-service-scene__flow-dot" cx="147" cy="69" r="5" />
            <circle className="v2-service-scene__signal v2-service-scene__flow-dot v2-service-scene__flow-dot--late" cx="293" cy="171" r="5" />
          </>
        );
      case "highload":
        return (
          <>
            <path className="v2-service-scene__muted" d="M26 81h87M26 120h87M26 159h87" />
            <circle className="v2-service-scene__surface-strong v2-service-scene__pulse" cx="159" cy="120" r="42" />
            <path className="v2-service-scene__signal" d="M137 120h44M159 98v44" />
            <path className="v2-service-scene__line" d="M201 120h34l24-58h34M235 120h58M235 120l24 58h34" />
            {[44, 102, 160].map((y, index) => (
              <g key={y} className={`v2-service-scene__server v2-service-scene__server--${index + 1}`}>
                <rect className="v2-service-scene__surface" x="293" y={y} width="121" height="36" rx="12" />
                <circle className="v2-service-scene__signal-fill" cx="316" cy={y + 18} r="5" />
                <path className="v2-service-scene__muted" d={`M334 ${y + 18}h52`} />
              </g>
            ))}
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M26 120h91" />
          </>
        );
      case "support":
        return (
          <>
            <rect className="v2-service-scene__surface-strong" x="151" y="75" width="138" height="90" rx="24" />
            <path className="v2-service-scene__muted" d="M178 104h84M178 128h54" />
            <circle className="v2-service-scene__line v2-service-scene__rotate" cx="220" cy="120" r="91" />
            <path className="v2-service-scene__signal" d="M279 51l20 1-3 20" />
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M291 61a91 91 0 0 1-28 137" />
            <circle className="v2-service-scene__signal-fill v2-service-scene__pulse" cx="146" cy="55" r="10" />
            <circle className="v2-service-scene__surface" cx="313" cy="167" r="10" />
            <circle className="v2-service-scene__surface" cx="112" cy="154" r="10" />
          </>
        );
      case "iot":
        return (
          <>
            <circle className="v2-service-scene__surface-strong" cx="91" cy="122" r="42" />
            <circle className="v2-service-scene__signal-fill v2-service-scene__pulse" cx="91" cy="122" r="10" />
            <path className="v2-service-scene__signal v2-service-scene__wave" d="M59 91a44 44 0 0 1 64 0M46 77a63 63 0 0 1 90 0" />
            <rect className="v2-service-scene__surface" x="184" y="88" width="72" height="68" rx="20" />
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M133 122h51m72 0h47" />
            <path className="v2-service-scene__signal" d="m173 114 11 8-11 8m119-16 11 8-11 8" />
            <rect className="v2-service-scene__surface-strong" x="303" y="56" width="111" height="132" rx="18" />
            <path className="v2-service-scene__muted" d="M325 87h66M325 157h66" />
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M325 139l17-17 16 8 27-26" />
          </>
        );
      default:
        return (
          <>
            <rect className="v2-service-scene__surface-strong" x="53" y="39" width="334" height="168" rx="26" />
            <path className="v2-service-scene__muted" d="M53 76h334" />
            <circle className="v2-service-scene__signal-fill" cx="79" cy="58" r="5" />
            <circle className="v2-service-scene__surface" cx="98" cy="58" r="5" />
            <rect className="v2-service-scene__surface" x="83" y="101" width="140" height="76" rx="17" />
            <rect className="v2-service-scene__line" x="245" y="101" width="112" height="25" rx="10" />
            <rect className="v2-service-scene__line" x="245" y="139" width="78" height="38" rx="10" />
            <path className="v2-service-scene__signal v2-service-scene__flow" d="M101 151l25-23 22 12 39-28" />
          </>
        );
    }
  })();

  return (
    <div className="v2-service-scene" data-service={id} aria-hidden="true">
      <svg viewBox="0 0 440 240" preserveAspectRatio="xMidYMid meet">
        {scene}
      </svg>
    </div>
  );
}

export default ServiceVisual;
