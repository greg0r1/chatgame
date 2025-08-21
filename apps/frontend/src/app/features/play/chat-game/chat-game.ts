import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type LangKey = 'fr';
type SignalStrength = 'faible' | 'moyen' | 'fort';
type BlockType = 'opening' | 'implicitHint' | 'explicitHint' | 'partialReveal' | 'validation';

interface LocalizedText {
  fr: string;
}
interface MessageBlock {
  id: string;
  levelId: number;
  contactId: string;
  type: BlockType;
  signal: SignalStrength;
  text: LocalizedText;
}
interface ContactCard {
  id: string;
  usageName: string;
  photo?: string;
  description: Record<LangKey, string>;
}
interface RoundScript {
  levelId: number;
  contactId: string;
  suspects: string[];
  blocks: MessageBlock[];
}

const CONTACTS: ContactCard[] = [
  {
    id: 'curie',
    usageName: 'Marie Curie',
    description: {
      fr: 'Physicienne et chimiste franco-polonaise, découvreuse du polonium et du radium, double Prix Nobel.',
    },
  },
  {
    id: 'davinci',
    usageName: 'Léonard de Vinci',
    description: {
      fr: 'Artiste et inventeur italien de la Renaissance, auteur de la Joconde et de carnets visionnaires.',
    },
  },
  {
    id: 'christie',
    usageName: 'Agatha Christie',
    description: {
      fr: 'Romancière britannique, reine du crime, créatrice d’Hercule Poirot et de Miss Marple.',
    },
  },
];

const ROUNDS: RoundScript[] = [
  {
    levelId: 1,
    contactId: 'curie',
    suspects: ['curie', 'davinci', 'christie'],
    blocks: [
      {
        id: 'c1-1',
        levelId: 1,
        contactId: 'curie',
        type: 'opening',
        signal: 'faible',
        text: { fr: 'Tu es encore au labo si tôt ? On dirait moi avec mon tablier.' },
      },
      {
        id: 'c1-2',
        levelId: 1,
        contactId: 'curie',
        type: 'implicitHint',
        signal: 'faible',
        text: {
          fr: 'Quand Paris se tait, je pense à Varsovie. Toi aussi tu as une ville-refuge ?',
        },
      },
      {
        id: 'c1-3',
        levelId: 1,
        contactId: 'curie',
        type: 'implicitHint',
        signal: 'moyen',
        text: { fr: 'Promets de garder le secret si je te dis que deux éléments me hantent.' },
      },
      {
        id: 'c1-4',
        levelId: 1,
        contactId: 'curie',
        type: 'explicitHint',
        signal: 'fort',
        text: { fr: 'On m’a déjà remis deux distinctions… dans deux sciences différentes.' },
      },
      {
        id: 'c1-5',
        levelId: 1,
        contactId: 'curie',
        type: 'explicitHint',
        signal: 'fort',
        text: { fr: 'Je t’attends boulevard Edgar-Quinet, la lumière y dure tard.' },
      },
    ],
  },
  {
    levelId: 2,
    contactId: 'davinci',
    suspects: ['curie', 'davinci', 'christie'],
    blocks: [
      {
        id: 'd2-1',
        levelId: 2,
        contactId: 'davinci',
        type: 'opening',
        signal: 'faible',
        text: { fr: 'Je finis ce portrait ou je teste ma machine volante ? À toi de trancher.' },
      },
      {
        id: 'd2-2',
        levelId: 2,
        contactId: 'davinci',
        type: 'implicitHint',
        signal: 'faible',
        text: { fr: 'Les tourbillons de l’eau m’enseignent tout. Tu observes aussi ?' },
      },
      {
        id: 'd2-3',
        levelId: 2,
        contactId: 'davinci',
        type: 'implicitHint',
        signal: 'moyen',
        text: { fr: 'Mes débuts à Florence me reviennent. Tu connais l’atelier ?' },
      },
      {
        id: 'd2-4',
        levelId: 2,
        contactId: 'davinci',
        type: 'explicitHint',
        signal: 'fort',
        text: { fr: 'Tout le monde parle d’un sourire. Tu le vois aussi, n’est-ce pas ?' },
      },
      {
        id: 'd2-5',
        levelId: 2,
        contactId: 'davinci',
        type: 'explicitHint',
        signal: 'fort',
        text: { fr: 'Passe à Amboise, on y parle d’art avec un roi.' },
      },
    ],
  },
  {
    levelId: 3,
    contactId: 'christie',
    suspects: ['curie', 'davinci', 'christie'],
    blocks: [
      {
        id: 'a3-1',
        levelId: 3,
        contactId: 'christie',
        type: 'opening',
        signal: 'faible',
        text: { fr: 'Tu lis dans les trains ? Moi j’y écris, le wagon souffle l’intrigue.' },
      },
      {
        id: 'a3-2',
        levelId: 3,
        contactId: 'christie',
        type: 'implicitHint',
        signal: 'faible',
        text: { fr: 'Un ami à la moustache mesure tout, même tes silences.' },
      },
      {
        id: 'a3-3',
        levelId: 3,
        contactId: 'christie',
        type: 'implicitHint',
        signal: 'moyen',
        text: { fr: 'L’Orient m’a offert des crimes somptueux. Tu en as pris un de nuit ?' },
      },
      {
        id: 'a3-4',
        levelId: 3,
        contactId: 'christie',
        type: 'explicitHint',
        signal: 'fort',
        text: { fr: 'J’ai disparu une fois. J’ai laissé tout le monde perplexe.' },
      },
      {
        id: 'a3-5',
        levelId: 3,
        contactId: 'christie',
        type: 'explicitHint',
        signal: 'fort',
        text: { fr: 'Dix petits… si tu connais la fin, tu me connais.' },
      },
    ],
  },
];

@Component({
  selector: 'app-chat-game',
  standalone: true,
  templateUrl: './chat-game.html',
  imports: [NgClass],
})
export class ChatGame {
  Math = Math;
  levelIdx = signal(0);
  round = computed(() => ROUNDS[this.levelIdx()]);
  correct = computed(() => CONTACTS.find((c) => c.id === this.round().contactId)!);
  suspectsFull = computed(() => CONTACTS.filter((c) => this.round().suspects.includes(c.id)));

  turns = signal(1);
  shownBlocks = signal<MessageBlock[]>([this.round().blocks[0]]);
  typing = signal(false);
  mult = signal(1);
  score = signal(0);
  roundOver = signal(false);
  selected = signal<string | null>(null);
  resolved = signal<ContactCard | null>(null);
  toast = signal<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);
  profileOpen = signal(false);
  pickerOpen = signal(false);
  winOpen = signal(false);
  loseOpen = signal(false);
  lastLost = signal(0);

  canNext = computed(
    () =>
      this.shownBlocks().length < this.round().blocks.length && !this.typing() && !this.roundOver()
  );

  nextMessage() {
    if (!this.canNext()) return;
    this.typing.set(true);
    setTimeout(() => {
      const i = this.shownBlocks().length;
      this.shownBlocks.set([...this.shownBlocks(), this.round().blocks[i]]);
      this.turns.set(this.turns() + 1);
      this.mult.set(Math.max(0, Math.round(this.mult() * 0.9 * 100) / 100));
      this.typing.set(false);
    }, 700);
  }

  openPicker() {
    if (this.roundOver()) return;
    this.pickerOpen.set(true);
  }

  nextLevel() {
    this.levelIdx.set((this.levelIdx() + 1) % ROUNDS.length);
    this.turns.set(1);
    this.shownBlocks.set([this.round().blocks[0]]);
    this.typing.set(false);
    this.mult.set(1);
    this.roundOver.set(false);
    this.selected.set(null);
    this.toast.set(null);
    this.resolved.set(null);
    this.winOpen.set(false);
    this.loseOpen.set(false);
  }

  validateGuess() {
    const s = this.selected();
    if (!s) return;
    if (s === this.correct().id) {
      const gained = Math.max(10, Math.round(100 * this.mult()));
      this.score.set(this.score() + gained);
      this.roundOver.set(true);
      this.resolved.set(this.correct());
      this.toast.set({
        kind: 'success',
        text: `Bonne réponse : ${this.correct().usageName} (+${gained})`,
      });
      this.winOpen.set(true);
    } else {
      const lost = 10;
      this.lastLost.set(lost);
      this.score.set(Math.max(0, this.score() - lost));
      this.toast.set({ kind: 'error', text: 'Mauvaise réponse' });
      this.mult.set(Math.max(0, Math.round(this.mult() * 0.9 * 100) / 100));
      this.loseOpen.set(true);
    }
    this.pickerOpen.set(false);
  }
}
