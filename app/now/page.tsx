import BlurFade from '@/components/ui/blur-fade';

export default function Now() {
  return (
    <section>
      <BlurFade delay={0.09}>
        <h1 className='font-medium text-2xl mb-8 tracking-tighter'>Now</h1>
      </BlurFade>

      <BlurFade delay={0.2}>
        <p className='text-sm mb-4'>- coaching tennis</p>
        <p className='text-sm mb-4'>
          - walking Loki - my 3 year old doodle best friend
        </p>
        <p className='text-sm mb-4'>- reading: Open - Andre Agassi</p>
      </BlurFade>
    </section>
  );
}
