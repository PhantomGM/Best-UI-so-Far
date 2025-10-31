
import React from 'react';
import { WorldFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<WorldFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const WorldDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="space-y-4">
        <FormField label="Genre or Mood" htmlFor="genreOrMood" description="E.g., Grimdark, Whimsical Mystery, Post-Apocalyptic Hope">
            <input type="text" id="genreOrMood" name="genreOrMood" value={formData.genreOrMood || ''} onChange={onChange} />
        </FormField>
        <FormField label="Core Theme or Central Struggle" htmlFor="coreTheme" description="E.g., Survival against extinction, Rebellion against false gods, Rebuilding after collapse">
            <input type="text" id="coreTheme" name="coreTheme" value={formData.coreTheme || ''} onChange={onChange} />
        </FormField>
        <FormField label="Inspirational Media, Vibes, or Tropes" htmlFor="inspirationalMedia" description="E.g., Nausicaa + Dune, Elden Ring + Evangelion, A world where deserts whisper back" isTextArea>
            <textarea id="inspirationalMedia" name="inspirationalMedia" value={formData.inspirationalMedia || ''} onChange={onChange} rows={2} />
        </FormField>
        <FormField label="Magic & Technology Flavor" htmlFor="magicAndTechFlavor" description="E.g., “Tech is sacred relics,” “Magic is fading and feared,” “Everything runs on breath-powered engines”" isTextArea>
            <textarea id="magicAndTechFlavor" name="magicAndTechFlavor" value={formData.magicAndTechFlavor || ''} onChange={onChange} rows={2} />
        </FormField>
        <FormField label="Geographical Inspirations or Must-Have Land Features" htmlFor="geographicalInspirations" description="E.g., Floating mountain chains, underground oceans, shattered archipelago">
            <input type="text" id="geographicalInspirations" name="geographicalInspirations" value={formData.geographicalInspirations || ''} onChange={onChange} />
        </FormField>
         <FormField label="Cultural, Philosophical, or Religious Influence" htmlFor="culturalInfluence" description="E.g., Stoicism and ancestor worship dominate daily life; No gods—only contracts">
            <input type="text" id="culturalInfluence" name="culturalInfluence" value={formData.culturalInfluence || ''} onChange={onChange} />
        </FormField>
        <FormField label="Desired Number of Major Regions" htmlFor="numRegions" description="If known. E.g., 3, 5">
            <input type="number" id="numRegions" name="numRegions" value={formData.numRegions || ''} onChange={onChange} min="1" max="10" />
        </FormField>
        <FormField label="Faction Type, Conflict, or Historic Echo" htmlFor="factionConflict" description="E.g., A fallen religious empire still rules through banking; A cold war between magic schools" isTextArea>
            <textarea id="factionConflict" name="factionConflict" value={formData.factionConflict || ''} onChange={onChange} rows={2} />
        </FormField>
        <FormField label="Known Details You’d Like Reflected" htmlFor="knownDetails" description="E.g., This is a sequel setting to my homebrew world; Time is fractured, but no one remembers" isTextArea>
            <textarea id="knownDetails" name="knownDetails" value={formData.knownDetails || ''} onChange={onChange} rows={2} />
        </FormField>
        <FormField label="Additional Notes or Story Seeds to Weave In" htmlFor="additionalNotes" description="E.g., A god left behind a machine no one dares touch; All the birds are spies" isTextArea>
            <textarea id="additionalNotes" name="additionalNotes" value={formData.additionalNotes || ''} onChange={onChange} rows={2} />
        </FormField>
    </div>
);

export default WorldDetailedForm;