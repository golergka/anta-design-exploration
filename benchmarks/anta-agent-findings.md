# How coding agents used and misused Anta

## Patterns of error

| Pattern                                                   | What to look for in generated code                                                                                   | What a better result preserves                                                                                                          |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Rebuilding a supplied interaction                      | A row of buttons implements tab selection, or a message and a close button recreate a notice.                        | The app supplies its data and actions. Anta provides roles, focus behavior, selection, and presentation where supported.                |
| 2. Rebuilding the inside of a supplied component          | The agent imports a Card but builds the title, subtitle, and their layout again inside its body.                     | The app uses the supplied regions and adds layout only for content those regions do not arrange.                                        |
| 3. Losing built-in behavior when adding one custom action | A close button is needed on each file tab, so the agent replaces the whole tab strip and drops arrow-key navigation. | The extra action works alongside the original selection and focus behavior.                                                             |
| 4. Adding elements just for spacing or decoration         | Empty flex children push content aside. Empty spans draw lines.                                                      | CSS positions existing elements or draws decoration. This measures general composition skill as well as the clarity of Anta’s guidance. |
| 5. Inferring an API contract from a familiar name         | The agent passes a state setter to an event-first callback, or guesses a plausible semantic tone.                    | Public types and runtime behavior guide the agent toward the same interpretation.                                                       |

The evidence comes from 12 frontend fixtures built in two rounds with Anta 0.3.38. Five agents’ app designs were exercised again with third-party libraries, alongside a Bootstrap migration and native form probes. The examples below distinguish observed implementation choices from proposed alternatives. The proposed substitutions have not been visually regression-tested. [Archived source](https://github.com/golergka/anta-design-exploration/tree/ec0f3b1) · [Live fixtures](https://anta.golergka.com/)

## Examples from the project

### Feed tabs — an existing interaction rebuilt from HTML

The original X feed used a button per view, a selected class, and a span to give the underline the width of its label. The app stylesheet supplied the underline and hover state. The buttons did not provide tab roles or arrow-key selection. The second-round X fixture used Anta Tabs for the same two labels. [Original JSX](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/x/src/main.tsx#L162-L175) · [Original CSS](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/x/src/style.css#L123-L158) · [Second-round implementation](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/compat-x/src/main.tsx#L69-L78)

**Before** (abridged)

```tsx
<div className="tabs">
  {['For you', 'Following'].map((t) => (
    <button
      key={t}
      className={tab === t ? 'selected' : ''}
      onClick={() => {
        setTab(t);
        setSection('Home');
      }}
    >
      <span>{t}</span>
    </button>
  ))}
</div>
```

**Proposed for the original feed**

```tsx
<Tabs
  label="Home feed"
  priority="tertiary"
  fill
  style={{ flex: 1 }}
  value={tab}
  options={[
    { value: 'For you', label: 'For you' },
    { value: 'Following', label: 'Following' },
  ]}
  onStateChange={(_, { next }) => {
    if (next) {
      setTab(next);
      setSection('Home');
    }
  }}
/>
```

The app still owns which feed to show and where the strip fits in the header. Anta takes over selection semantics, keyboard navigation, and indicator styling. The original handler also navigated Home on a second click on the selected tab. A selection-change handler alone does not guarantee that behavior. Include an explicit reselect case if a benchmark requires it. [Tabs documentation](https://anta.design/tabs/)

Slack independently built Messages, Files, and About as buttons. Its adjacent plus button is a separate action and can stay beside Tabs. Datadog built All services and Needs attention in the same way. Its count can be custom content inside an Anta tab. Both apps also hand-built dismissible notices, which fit Banner. [Slack tabs and notice](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/slack/src/main.tsx#L298-L335) · [Datadog tabs](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/datadog/src/main.tsx#L406-L427) · [Banner](https://anta.design/banner/)

### Dashboard cards — the agent imported Card and rebuilt its header

Three Datadog chart cards each contain a hand-built heading stack and an overflow button. The chart, metric, and legend are application content. [Source](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/datadog/src/main.tsx#L334-L389)

**Before**

```tsx
<Card size="small">
  <div className="chart-head">
    <div>
      <b>Request volume</b>
      <small>Requests per second</small>
    </div>
    <button>···</button>
  </div>
  {/* metric, chart, legend */}
</Card>
```

**Proposed with the visible overflow control retained**

```tsx
<Card
  size="small"
  header={
    <div className="chart-head">
      <Title level={4}>Request volume</Title>
      <Button
        icon="more"
        size="small"
        priority="tertiary"
        aria-label="Request volume options"
      />
    </div>
  }
  subtitle="Requests per second"
>
  {/* metric, chart, legend */}
</Card>
```

The inner heading wrapper, literal dots, and local heading typography disappear from app code. The flex row remains because Card has no dedicated action slot. The original overflow button had no handler. For a fixture that only asks for a title and subtitle, the entire header reduces to two strings. [Card header controls](https://anta.design/card/#header-controls)

```tsx
<Card size="small" header="Request volume" subtitle="Requests per second">
  {/* metric, chart, legend */}
</Card>
```

### Closable editor tabs — where a custom action changes the problem

The original IDE uses Anta Tabs to switch Problems and Query results. In the same file, its editor strip maps each open file to separate select and close buttons. Closing is a real additional requirement. Anta documents custom label content and trailing icons, but a decorative icon supplies neither an independent close action nor a focus policy after removal. The replacement omitted arrow-key navigation. [File tabs](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/ide/src/main.tsx#L219-L240) · [Output tabs](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/ide/src/main.tsx#L311-L325) · [Tab content API](https://anta.design/tabs/#icons-and-content)

This is a different benchmark from ordinary feed tabs. A custom implementation can succeed if it preserves selection, keyboard traversal, accessible tab state, and predictable focus after close. A documented composition or built-in close action would give agents a supported path.

### Unnecessary wrappers — where ordinary CSS is enough

The IDE uses an empty flex child to push actions to the end. Move the spacing to the existing action element. The toolbar repeats the same pattern with a top spacer before the environment label. [Markup](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/ide/src/main.tsx#L239-L244) · [CSS](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/ide/src/style.css#L344-L350)

```diff
- <div className="tab-space" />
  <span className="tab-actions"><Icon shape="columns-3-cog" size={16} /></span>

- .tab-space { flex: 1; }
+ .tab-actions { margin-inline-start: auto; }
```

ChatGPT uses two empty spans to draw the date divider’s horizontal rules. The row and its text remain. [Markup](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/chatgpt/src/main.tsx#L294-L299) · [CSS](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/chatgpt/src/style.css#L225-L239)

```diff
- <div className="date-label"><span /> TODAY <span /></div>
+ <div className="date-label">TODAY</div>

- .date-label span {
+ .date-label::before, .date-label::after {
+   content: '';
    height: 1px;
    background: #edf0ec;
    flex: 1;
  }
```

These changes remove rendered nodes. Switching to Tabs or Card mainly removes application-authored markup. A benchmark that counts the final DOM alone would conflate the two outcomes.

### API assumptions — code that type-checked with the wrong meaning

The X search field passed `onValueChange={setQuery}`. Anta Input passes the event first and the value in the second argument. Typing produced `[object InputEvent]`. Select accepts a value-first handler under the same prop name. The compatibility dashboard uses both conventions side by side. A uniform value callback would remove the ambiguity. A precise event type would catch the incorrect setter. [X search](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/x/src/main.tsx#L309-L316) · [Dashboard inputs](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/compat-datadog/src/main.jsx#L136-L149)

The IDE rendered a success Tag with `tone="positive"`. The named Anta tone is `success`. Because the prop also accepts custom CSS colors, the declaration admits this unrecognized string. This is an invalid tone choice even without assuming a particular visual symptom. [IDE tag](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/ide/src/main.tsx#L385) · [Tag](https://anta.design/tag/)

## Coverage across the 12 fixtures

| Fixture                           | Reuse opportunity or reason to retain custom structure                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IDE                               | Avatar for the JD badge, Expander for the folder disclosure, CSS for spacers. The editor host and file close behavior have independent jobs.                                                                                                            |
| Slack                             | Tabs, Banner, and icon Buttons. The thread layout and composer keyboard policy are app-specific.                                                                                                                                                        |
| ChatGPT                           | Input for sidebar search, Tag for the model badge, Card for the answer surface. The numbered answer content and scroll layout remain custom.                                                                                                            |
| Datadog                           | Card regions, Tabs, Banner, Avatar, Input, and icon Buttons. The plot and metric content remain custom.                                                                                                                                                 |
| X                                 | Tabs and icon Buttons. Feed selection and reaction counts remain app state.                                                                                                                                                                             |
| IDE + Tailwind/Monaco             | Uses built-in tabs. Tailwind toolbar groups exercise responsive spacing, and the editor host establishes dimensions.                                                                                                                                    |
| Slack + React Hook Form           | Five hand-built initial avatars duplicate Avatar. The extra wrapper around Input actually connects form focus to the custom element. [Source](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/compat-slack/src/main.tsx#L93-L161) |
| ChatGPT + Next.js                 | Uses Anta controls. Its live region, centered welcome group, and compose row serve distinct purposes.                                                                                                                                                   |
| Datadog + TanStack Table/Recharts | Chart heading and surface can use Card. The responsive chart host and table sorting machinery belong to their integrations.                                                                                                                             |
| X + TanStack Query/Virtual        | Initial tiles can use Avatar. Scroll viewport, total-height spacer, and positioned rows implement virtualization. [Source](https://github.com/golergka/anta-design-exploration/blob/ec0f3b1/apps/compat-x/src/main.tsx#L106-L143)                       |
| Bootstrap migration               | The untouched Bootstrap region is the comparison baseline. Replacing it would compromise the experiment.                                                                                                                                                |
| Native form probes                | The native and Anta branches deliberately render different controls for paired tests.                                                                                                                                                                   |

## Turning these cases into small benchmarks

Use behavior-oriented prompts on the first run. Record component choice, retained behavior, and avoidable authored structure separately. Pin Anta and the model version and repeat the same prompt when comparing documentation or API revisions.

| Small task                                                     | Observable checks                                                                                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Switch between two feeds                                       | Inspect component choice. Verify accessible tab names, selected state, arrow-key selection, and corresponding content.                                   |
| Render a chart card, first without an action and then with one | Inspect use of header and subtitle. Verify that the second version retains a named action and the chart body. Permit the row that positions the action.  |
| Build a three-file editor strip                                | Open and close active and inactive files with the keyboard. Check tab traversal and focus after removal. Score custom code by the behavior it preserves. |
| Right-align toolbar actions and draw a labeled divider         | Inspect authored empty elements and test narrow and wide layouts. Include a virtualized list as a control where a spacer is justified.                   |
| Add search and a team selector                                 | Type, select, and clear. Assert the actual values in application state. Record whether the installed types catch a wrongly wired callback.               |
| Show a success status and a dismissible notice                 | Check the semantic tone and the notice’s dismissal behavior. Record whether the agent found Tag and Banner without their names in the prompt.            |

A single observed failure motivates a sample. To estimate how often agents make it, count independent runs with the same requirement and record how many had a genuine opportunity to use the built-in.
