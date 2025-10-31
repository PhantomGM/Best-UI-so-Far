import React from 'react';
import { RegionFormData } from '../../types';
import FormField from '../common/FormField';

interface Props {
    formData: Partial<RegionFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const RegionDetailedForm: React.FC<Props> = ({ formData, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Region Name" htmlFor="name"><input type="text" id="name" name="name" value={formData.name || ''} onChange={onChange} /></FormField>
        <FormField label="Dominant Feature" htmlFor="dominantFeature" description="The most defining characteristic. E.g., A giant crystal, a perpetual storm."><input type="text" id="dominantFeature" name="dominantFeature" value={formData.dominantFeature || ''} onChange={onChange} /></FormField>
        <FormField label="Climate" htmlFor="climate"><input type="text" id="climate" name="climate" value={formData.climate || ''} onChange={onChange} /></FormField>
        <FormField label="Culture" htmlFor="culture" description="The defining traits of the people. E.g., Nomadic hunters, reclusive scholars."><input type="text" id="culture" name="culture" value={formData.culture || ''} onChange={onChange} /></FormField>
        <FormField label="Major Conflict" htmlFor="majorConflict"><input type="text" id="majorConflict" name="majorConflict" value={formData.majorConflict || ''} onChange={onChange} /></FormField>
        <FormField label="Main Exports" htmlFor="mainExports" description="What does this region produce? E.g., Rare ores, magical beasts."><input type="text" id="mainExports" name="mainExports" value={formData.mainExports || ''} onChange={onChange} /></FormField>
        <FormField label="Historical Tidbit" htmlFor="historicalTidbit"><input type="text" id="historicalTidbit" name="historicalTidbit" value={formData.historicalTidbit || ''} onChange={onChange} /></FormField>
        <FormField label="Primary Threat" htmlFor="primaryThreat"><input type="text" id="primaryThreat" name="primaryThreat" value={formData.primaryThreat || ''} onChange={onChange} /></FormField>
        <FormField label="Key Landmark" htmlFor="keyLandmark"><input type="text" id="keyLandmark" name="keyLandmark" value={formData.keyLandmark || ''} onChange={onChange} /></FormField>
        <FormField label="Magic Level" htmlFor="magicLevel" description="High, Low, Wild, etc."><input type="text" id="magicLevel" name="magicLevel" value={formData.magicLevel || ''} onChange={onChange} /></FormField>
        <div className="md:col-span-2">
            <FormField label="Extra Context" htmlFor="extraContext" isTextArea>
                <textarea id="extraContext" name="extraContext" value={formData.extraContext || ''} onChange={onChange} rows={3} />
            </FormField>
        </div>
    </div>
);

export default RegionDetailedForm;
