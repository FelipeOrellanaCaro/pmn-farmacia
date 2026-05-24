import { useState } from 'react'

export default function PasoEscaneo({ venta, onCorrecto, onLeve, onGrave }) {
  const [modoLeve, setModoLeve] = useState(false)
  const sugerido = venta.loteSugerido

  if (modoLeve) {
    return (
      <div className="paso">
        <h3>4. Escaneo de caja física</h3>
        <div className="alert warning">
          El lote escaneado es <b>distinto</b> al sugerido, pero es un lote válido y vigente
          (discrepancia leve). ¿Deseas usar el lote físico?
        </div>
        <div className="acciones col">
          <button className="btn" onClick={() => onLeve(true)}>
            Usar lote físico (registrar discrepancia)
          </button>
          <button className="btn secondary" onClick={() => onLeve(false)}>
            Cancelar venta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="paso">
      <h3>4. Escaneo de caja física</h3>
      <p className="step-desc">
        Escanea el código del lote en la caja física. Debe coincidir con el lote
        sugerido (<b>{sugerido.codigo}</b>).
      </p>

      <div className="acciones col">
        <button className="btn" onClick={onCorrecto}>
          📷 El lote escaneado coincide ({sugerido.codigo})
        </button>
        <button className="btn secondary" onClick={() => setModoLeve(true)}>
          📷 Lote distinto pero válido (discrepancia leve)
        </button>
        <button className="btn danger" onClick={onGrave}>
          📷 Lote no vendible / con problema (discrepancia grave)
        </button>
      </div>
    </div>
  )
}
