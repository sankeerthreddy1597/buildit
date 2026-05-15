// buildit — design canvas app. Composes all sections + Tweaks.

const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#5a8a4a",
  "showAnnotations": true
}/*EDITMODE-END*/;

const ACCENTS = {
  '#c45a26': { light: '#c45a26', dark: '#e07845', faintL: '#fbf3e7', softL: '#f5e6cf', faintD: '#221a13', softD: '#2f231a', hoverL: '#b04d1e', hoverD: '#ec8855' },
  '#c98b1e': { light: '#c98b1e', dark: '#e6a93a', faintL: '#fbf3df', softL: '#f3e3bc', faintD: '#221c10', softD: '#332918', hoverL: '#a8731a', hoverD: '#f0b647' },
  '#a44a3a': { light: '#a44a3a', dark: '#c96a4d', faintL: '#f7e9e3', softL: '#ecd1c6', faintD: '#211512', softD: '#2f1d18', hoverL: '#8c3e30', hoverD: '#d97a5e' },
  '#5a8a4a': { light: '#5a8a4a', dark: '#82b06d', faintL: '#ecf2e4', softL: '#d3e1c4', faintD: '#161e10', softD: '#1f2a18', hoverL: '#4c7a3e', hoverD: '#94c47e' },
};

function applyAccent(name) {
  const a = ACCENTS[name] || ACCENTS['#c45a26'];
  const r = document.documentElement;
  r.style.setProperty('--accent', a.light);
  r.style.setProperty('--accent-hover', a.hoverL);
  r.style.setProperty('--accent-faint', a.faintL);
  r.style.setProperty('--accent-soft', a.softL);
  // also inject a per-theme override block so frames pick it up
  let s = document.getElementById('accent-override');
  if (!s) { s = document.createElement('style'); s.id = 'accent-override'; document.head.appendChild(s); }
  s.textContent = `
    .theme-light { --accent:${a.light}; --accent-hover:${a.hoverL}; --accent-faint:${a.faintL}; --accent-soft:${a.softL}; }
    .theme-dark  { --accent:${a.dark};  --accent-hover:${a.hoverD}; --accent-faint:${a.faintD}; --accent-soft:${a.softD}; }
  `;
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useE(() => { applyAccent(tweaks.accent); }, [tweaks.accent]);
  useE(() => { document.documentElement.dataset.annotations = tweaks.showAnnotations ? '1' : '0'; }, [tweaks.showAnnotations]);

  const theme = tweaks.theme;

  return (
    <>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Frames">
          <TweakRadio
            label="Theme"
            value={theme}
            onChange={v => setTweak('theme', v)}
            options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
          />
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={v => setTweak('accent', v)}
            options={['#c45a26', '#c98b1e', '#a44a3a', '#5a8a4a']}
          />
          <TweakToggle
            label="Annotations"
            value={tweaks.showAnnotations}
            onChange={v => setTweak('showAnnotations', v)}
          />
        </TweakSection>
      </TweaksPanel>

      <DesignCanvas>
        <DCSection id="brief" title="Handoff" subtitle="Tech stack, architecture, and notes for Claude Code">
          <DCArtboard id="brief" label="brief.md" width={1100} height={1600}>
            <TechBrief />
          </DCArtboard>
        </DCSection>

        <DCSection id="landing" title="Landing" subtitle="Final · editorial centered hero with margin notes">
          <DCArtboard id="landing-final" label="Landing · editorial centered" width={1440} height={1080}>
            <LandingA theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection id="plan" title="Plan mode" subtitle="Final · sectioned grid above the chat input">
          <DCArtboard id="plan-final" label="Plan · sectioned grid" width={920} height={760}>
            <PlanB theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection id="workspace" title="Workspace" subtitle="Chat + live E2B preview · the working state">
          <DCArtboard id="ws" label="Chat + preview" width={1440} height={900}>
            <Workspace theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection id="empty" title="Build in progress" subtitle="Final · streaming task list">
          <DCArtboard id="empty-final" label="Building · streaming tasks" width={1100} height={720}>
            <EmptyA theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection id="dashboard" title="Project dashboard">
          <DCArtboard id="dash" label="Projects list" width={1440} height={920}>
            <Dashboard theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection id="pricing" title="Pricing & credits">
          <DCArtboard id="pricing" label="Plans + top-ups" width={1440} height={1100}>
            <Pricing theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection id="auth" title="Auth">
          <DCArtboard id="signin" label="Sign in" width={900} height={720}>
            <AuthPanel mode="signin" theme={theme} />
          </DCArtboard>
          <DCArtboard id="signup" label="Create account" width={900} height={720}>
            <AuthPanel mode="signup" theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection id="picker" title="Model picker" subtitle="Hosted (Claude / OpenAI) + local Ollama">
          <DCArtboard id="model" label="Popover" width={540} height={700}>
            <ModelPicker theme={theme} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
