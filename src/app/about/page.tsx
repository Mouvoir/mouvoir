export default function AboutPage() {
  return (
    <>
      <h1 className="h-page">À propos</h1>
      <p
        className="text-[17px] leading-[1.5]"
        style={{ maxWidth: "1200px" }}
      >
        «Partycule» est un dispositif de VJing interactif qui place le public au
        cœur des visuels en temps réel. Le label collaboratif «Partycule»
        destiné aux VJs Finta et allié·e·s, proposent des outils
        d&apos;intéractivité permettant d&apos;intégrer le public au sein des
        visuels, de manière encadrée, éphémère, inclusive et anonyme.
      </p>

      <div className="flex justify-around gap-10 mt-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/giphy-12.gif"
          alt=""
          aria-hidden="true"
          className="w-[300px] h-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/giphy-12.gif"
          alt=""
          aria-hidden="true"
          className="w-[300px] h-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/giphy-12.gif"
          alt=""
          aria-hidden="true"
          className="w-[300px] h-auto"
        />
      </div>
    </>
  );
}
