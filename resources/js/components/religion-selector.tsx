import { SelectorWithLabel } from '@/components/selector-with-label';

interface ReligionSelectorProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

const RELIGION_OPTIONS = [
    { value: 'Aeta indigenous beliefs', label: 'Aeta indigenous beliefs' },
    { value: 'Agnosticism', label: 'Agnosticism' },
    { value: 'Ahmadiyya Muslim Community', label: 'Ahmadiyya Muslim Community' },
    { value: 'Anglican / Episcopal', label: 'Anglican / Episcopal' },
    { value: 'Animism', label: 'Animism' },
    { value: 'Anito (ancestral worship)', label: 'Anito (ancestral worship)' },
    { value: 'Assemblies of God', label: 'Assemblies of God' },
    { value: 'Atheism', label: 'Atheism' },
    { value: 'Babaylan traditions', label: 'Babaylan traditions' },
    { value: "Bahá'í Faith", label: "Bahá'í Faith" },
    { value: 'Baptist', label: 'Baptist' },
    { value: 'Bathala belief system', label: 'Bathala belief system' },
    { value: 'Bible Baptist Church', label: 'Bible Baptist Church' },
    { value: 'Bontoc traditional religion', label: 'Bontoc traditional religion' },
    { value: 'Born Again', label: 'Born Again' },
    { value: 'Buddhism', label: 'Buddhism' },
    { value: 'Church of God', label: 'Church of God' },
    { value: 'Church of Scientology', label: 'Church of Scientology' },
    { value: 'Church of the Nazarene', label: 'Church of the Nazarene' },
    { value: 'Confucianism', label: 'Confucianism' },
    { value: 'El Shaddai (Catholic Charismatic)', label: 'El Shaddai (Catholic Charismatic)' },
    { value: 'Eckankar', label: 'Eckankar' },
    { value: 'Evangelical Christianity', label: 'Evangelical Christianity' },
    { value: 'Falun Gong', label: 'Falun Gong' },
    { value: 'Foursquare Gospel Church', label: 'Foursquare Gospel Church' },
    { value: 'Hinduism', label: 'Hinduism' },
    { value: 'Humanism', label: 'Humanism' },
    { value: 'Iglesia ni Cristo', label: 'Iglesia ni Cristo' },
    { value: 'Ifugao traditional religion', label: 'Ifugao traditional religion' },
    { value: "Jehovah's Witnesses", label: "Jehovah's Witnesses" },
    { value: 'Jesus Is Lord Church', label: 'Jesus Is Lord Church' },
    { value: 'Jainism', label: 'Jainism' },
    { value: 'Judaism', label: 'Judaism' },
    { value: 'Kalinga traditional religion', label: 'Kalinga traditional religion' },
    { value: 'Katalonan traditions', label: 'Katalonan traditions' },
    { value: 'Kulam (witchcraft)', label: 'Kulam (witchcraft)' },
    { value: 'Lutheran', label: 'Lutheran' },
    { value: 'Lumad traditional religion', label: 'Lumad traditional religion' },
    { value: 'Mahāyāna Buddhism', label: 'Mahāyāna Buddhism' },
    { value: 'Mangyan traditional religion', label: 'Mangyan traditional religion' },
    { value: 'Methodist', label: 'Methodist' },
    { value: 'Neo-Paganism', label: 'Neo-Paganism' },
    { value: 'New Age', label: 'New Age' },
    { value: 'New Thought', label: 'New Thought' },
    { value: 'Orthodox Christianity', label: 'Orthodox Christianity' },
    { value: 'Palawan indigenous religion', label: 'Palawan indigenous religion' },
    { value: 'Pentecostal', label: 'Pentecostal' },
    { value: 'Philippine Independent Church (Aglipayan Church)', label: 'Philippine Independent Church (Aglipayan Church)' },
    { value: 'Presbyterian', label: 'Presbyterian' },
    { value: 'Protestant', label: 'Protestant' },
    { value: 'Quakers (Religious Society of Friends)', label: 'Quakers (Religious Society of Friends)' },
    { value: 'Raëlism', label: 'Raëlism' },
    { value: 'Roman Catholicism', label: 'Roman Catholicism' },
    { value: 'Seventh-day Adventist Church', label: 'Seventh-day Adventist Church' },
    { value: 'Shamanism', label: 'Shamanism' },
    { value: 'Shia Islam', label: 'Shia Islam' },
    { value: 'Sikhism', label: 'Sikhism' },
    { value: 'Spiritualism', label: 'Spiritualism' },
    { value: 'Sunni Islam', label: 'Sunni Islam' },
    { value: 'Taoism', label: 'Taoism' },
    { value: 'The Church of Jesus Christ of Latter-day Saints (Mormons)', label: 'The Church of Jesus Christ of Latter-day Saints (Mormons)' },
    { value: 'The Kingdom of Jesus Christ', label: 'The Kingdom of Jesus Christ' },
    { value: 'Theosophy', label: 'Theosophy' },
    { value: 'Theravāda Buddhism', label: 'Theravāda Buddhism' },
    { value: 'Tibetan Buddhism', label: 'Tibetan Buddhism' },
    { value: 'Unitarian Universalism', label: 'Unitarian Universalism' },
    { value: 'United Church of Christ in the Philippines (UCCP)', label: 'United Church of Christ in the Philippines (UCCP)' },
    { value: 'Universal Life Church', label: 'Universal Life Church' },
    { value: 'Victory Christian Fellowship', label: 'Victory Christian Fellowship' },
    { value: 'Visayan folk religion', label: 'Visayan folk religion' },
    { value: 'Wicca', label: 'Wicca' },
    { value: 'Zoroastrianism', label: 'Zoroastrianism' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
    { value: 'Other', label: 'Other' },
];

export default function ReligionSelector({
    id = 'religion',
    value = 'Prefer not to say',
    onChange,
    error,
    required = false,
    className,
}: ReligionSelectorProps) {
    return (
        <SelectorWithLabel
            id={id}
            label="Religion"
            value={value}
            onChange={onChange}
            options={RELIGION_OPTIONS}
            error={error}
            required={required}
            placeholder="Select religion"
            className={className}
        />
    );
}
