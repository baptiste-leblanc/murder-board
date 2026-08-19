  /* ---------- Sound ---------- */
  let audioCtx = null; let soundOn = true;
  function ctx(){ if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } return audioCtx; }
  function beep(freq, duration, type, vol){
    if(!soundOn) return;
    try{
      const c = ctx(); const osc = c.createOscillator(); const gain = c.createGain();
      osc.type = type || 'sine'; osc.frequency.value = freq; gain.gain.value = vol || 0.05;
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
      osc.connect(gain); gain.connect(c.destination); osc.start(); osc.stop(c.currentTime + duration);
    }catch(e){}
  }
  function playTick(u){ beep(u?1300:900,0.06,'square',u?0.06:0.03); }
  function playPin(){ beep(500,0.08,'triangle',0.05); beep(300,0.1,'triangle',0.03); }
  function playChime(){ beep(660,0.12,'sine',0.05); setTimeout(()=>beep(880,0.18,'sine',0.05),120); }
  function playSuccess(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.2,'sine',0.06), i*110)); }
  function playFail(){ beep(220,0.3,'sawtooth',0.05); setTimeout(()=>beep(160,0.4,'sawtooth',0.05),150); }
  document.getElementById('soundBtn').addEventListener('click', (e)=>{ soundOn=!soundOn; e.target.textContent = soundOn?'🔊':'🔇'; });

  /* ================= CASE DATA ================= */
  const CASES = [
    {
      id:'vasseur', tab:'Dossier n° 1997-118', title:"L'affaire du Manoir Vasseur",
      victimLine:"Victime : Gérard Vasseur, collectionneur d'art, retrouvé sans vie dans sa bibliothèque le 14 octobre, vers 23h.",
      teaser:"Un collectionneur d'art retrouvé mort dans sa bibliothèque, pendant une soirée mondaine haute en tensions.",
      difficulty:"Facile", totalSeconds:480, maxAttempts:3,
      suspects:[
        { id:'camille', name:'Camille Vasseur', role:'Épouse', bio:'En instance de divorce, principale héritière.', color:'#8a4b6b', statement:"« Je n'ai pas mis les pieds dans le manoir ce soir-là. J'étais au théâtre avec une amie. »" },
        { id:'julien', name:'Julien Fontaine', role:'Assistant personnel', bio:'Dettes de jeu accumulées ces derniers mois.', color:'#4b6b8a', statement:"« J'ai quitté le manoir vers 21h pour aller jouer aux cartes. Je n'ai rien vu ni entendu. »" },
        { id:'sophie', name:'Sophie Reynaud', role:"Marchande d'art", bio:'Publiquement accusée de fraude par la victime.', color:'#8a6b3f', statement:"« Je n'ai pas revu Gérard depuis notre dispute au vernissage, il y a trois semaines. »" },
        { id:'marc', name:'Marc Delorme', role:'Ancien jardinier', bio:'Licencié sans préavis le mois dernier.', color:'#4b8a5b', statement:"« J'étais au bar du village toute la soirée, demandez à qui vous voulez. »" },
        { id:'isabelle', name:'Isabelle Vasseur', role:'Fille de la victime', bio:'Récemment exclue du testament familial.', color:'#8a4b4b', statement:"« J'étais en déplacement professionnel, loin d'ici, ce soir-là. »" },
        { id:'thomas', name:'Thomas Vasseur', role:'Frère, associé', bio:"Craint d'être écarté des parts de la maison de vente.", color:'#5b4b8a', statement:"« J'étais à l'hôtel Les Terrasses, à Lyon. J'ai un reçu si besoin. »" }
      ],
      baseEvidence:[
        { id:'agenda', title:'Agenda de la victime', preview:"Une page arrachée, rendez-vous noté à la hâte...", text:"Une page arrachée montre un rendez-vous noté à la hâte : « 22h45 — S.R., dernière chance. » L'écriture est tendue, presque rageuse.", correct:'sophie' },
        { id:'verres', title:'Deux verres de vin', preview:"Deux verres à moitié vides sur le bureau...", text:"Sur le bureau, deux verres à moitié vides. Le majordome affirme n'avoir servi qu'un seul invité ce soir-là — officiellement.", correct:'sophie' },
        { id:'majordome', title:'Témoignage du majordome', preview:"« J'ai entendu des éclats de voix vers 23h... »", text:"« J'ai entendu des éclats de voix vers 23h. Une femme, je crois. Puis plus rien. » Il n'a pas osé frapper à la porte de la bibliothèque.", correct:'sophie' },
        { id:'statuette', title:'Statuette en bronze', preview:"Le socle habituel de la bibliothèque est vide...", text:"Le socle habituel de la bibliothèque est vide. La statuette a été retrouvée dans la cheminée, hâtivement essuyée mais encore tachée.", correct:'sophie' },
        { id:'lettre', title:'Brouillon de lettre', preview:"Une lettre inachevée adressée à un critique d'art...", text:"Une lettre inachevée adressée à un critique d'art : « Je dénoncerai publiquement la marchande qui a vendu ce faux tableau sous mon nom... »", correct:'sophie' },
        { id:'theatre', title:'Billet de théâtre', preview:"Un talon de billet daté du soir du meurtre...", text:"Un talon de billet daté du soir du meurtre, au nom de Camille Vasseur. L'heure du spectacle couvre toute la soirée.", correct:'camille' },
        { id:'salle_jeu', title:'Reçu de salle de jeux', preview:"Un reçu horodaté place un suspect ailleurs...", text:"Un reçu horodaté à 21h32 place Julien Fontaine à l'autre bout de la ville, bien avant l'heure du crime.", correct:'julien' },
        { id:'train', title:'Billets de train', preview:"Un déplacement professionnel confirmé...", text:"Isabelle Vasseur était en déplacement professionnel ce jour-là, confirmé par des billets de train aller-retour.", correct:'isabelle' },
        { id:'bar', title:'Témoins du bar', preview:"Trois clients confirment sa présence au comptoir...", text:"Trois clients du bar du village confirment avoir vu Marc Delorme toute la soirée, passablement éméché mais bien présent au comptoir.", correct:'marc' },
        { id:'hotel', title:"Registre d'hôtel", preview:"Un reçu confirme une présence à Lyon ce soir-là...", text:"Le registre de l'hôtel Les Terrasses, à Lyon, confirme l'enregistrement de Thomas Vasseur à 20h12, avec paiement par carte le lendemain matin.", correct:'thomas' },
        { id:'contrat', title:'Contrat de la maison de vente', preview:"Un projet de restructuration des parts...", text:"Un projet de contrat prévoit de réduire la part de Thomas Vasseur dans la maison de vente familiale au profit d'un investisseur extérieur.", correct:'thomas' },
        { id:'legiste', title:'Rapport du légiste', preview:"L'heure de la mort est estimée...", text:"L'heure de la mort est estimée entre 22h30 et 23h15, ce qui coïncide avec le rendez-vous noté dans l'agenda de la victime.", correct:'sophie' }
      ],
      comboClues:[
        { triggers:['agenda','majordome'], id:'graphologie', title:'Analyse graphologique', correct:'sophie', preview:"Comparaison d'écritures avec un document de Sophie Reynaud...", text:"Comparée à une lettre de Sophie Reynaud retrouvée dans les affaires de la victime, l'écriture du rendez-vous noté dans l'agenda concorde avec la sienne." },
        { triggers:['contrat','hotel'], id:'motif_ecarte', title:"Note de l'enquêteur", correct:'thomas', preview:"Un mobile réel, mais une opportunité écartée...", text:"Le mobile de Thomas Vasseur est bien réel, mais son alibi vérifié à l'hôtel de Lyon élimine toute possibilité qu'il ait pu commettre le crime ce soir-là." },
        { triggers:['statuette','legiste'], id:'analyse_arme', title:'Rapport balistique', correct:'sophie', preview:"Traces retrouvées sur l'objet compatibles avec l'heure du décès...", text:"Les traces retrouvées sur la statuette en bronze sont compatibles avec l'heure de la mort établie par le légiste, confirmant qu'il s'agit bien de l'arme du crime." }
      ],
      weapons:['Statuette en bronze','Coupe-papier','Corde','Chandelier','Arme à feu','Poison'],
      motives:['Vengeance / réputation','Héritage','Dettes de jeu','Rupture amoureuse','Jalousie','Dispute sur un héritage familial'],
      solution:{ suspect:'sophie', weapon:'Statuette en bronze', motive:'Vengeance / réputation' },
      resolutionText:"Sophie Reynaud craquait sous la pression : accusée par Gérard Vasseur d'avoir vendu un tableau falsifié, elle est venue s'expliquer ce soir-là — puis a menti aux enquêteurs. L'agenda, les deux verres, le témoignage du majordome et la statuette retrouvée dans la cheminée le confirment. Thomas Vasseur, malgré un mobile réel, avait un alibi solide à Lyon."
    },

    {
      id:'theatre', tab:'Dossier n° 2002-142', title:'Le Rideau Rouge',
      victimLine:"Victime : Laurent Ferrand, directeur artistique du Théâtre des Ombres, retrouvé étranglé dans sa loge pendant l'entracte, vers 21h40.",
      teaser:"Un directeur de théâtre étranglé dans sa loge, en plein entracte, devant un public qui ne se doute de rien.",
      difficulty:"Moyen", totalSeconds:360, maxAttempts:3,
      suspects:[
        { id:'elise', name:'Élise Dumont', role:'Actrice principale', bio:'Rivalité artistique ; la victime voulait la remplacer par une actrice plus jeune.', color:'#8a4b6b', statement:"« J'étais sur scène à saluer le public quand c'est arrivé. Des centaines de témoins peuvent le confirmer. »" },
        { id:'antoine', name:'Antoine Brel', role:'Doublure', bio:'Impatient de percer, frustré de rester en coulisses.', color:'#4b6b8a', statement:"« J'étais dans ma loge à me préparer. Je n'ai rien remarqué d'anormal. »" },
        { id:'nadia', name:'Nadia Cohen', role:'Régisseuse', bio:'Dispute récente sur la sécurité du plateau.', color:'#8a6b3f', statement:"« J'étais occupée avec les changements de décor pour le deuxième acte, comme toujours pendant l'entracte. »" },
        { id:'marc', name:'Marc-Étienne Roy', role:'Producteur', bio:'Menaçait de couper les fonds si la mise en scène ne changeait pas.', color:'#4b8a5b', statement:"« J'étais au téléphone avec un investisseur à Londres pendant tout l'entracte. »" },
        { id:'julien', name:'Julien Verne', role:'Critique de théâtre', bio:'Menacé de poursuites en diffamation par la victime.', color:'#8a4b4b', statement:"« J'étais à un dîner d'affaires à l'autre bout de la ville, loin du théâtre. »" },
        { id:'sacha', name:'Sacha Lenoir', role:'Ancien électricien', bio:'Licencié récemment pour faute grave, rancunier.', color:'#5b4b8a', statement:"« Je n'ai plus remis les pieds dans ce théâtre depuis mon licenciement. »" }
      ],
      baseEvidence:[
        { id:'rapport_securite', title:'Rapport de sécurité falsifié', preview:"Les dates ne correspondent pas aux enregistrements officiels...", text:"Un rapport sur l'accident du mois dernier a été trafiqué : les dates ne correspondent pas aux enregistrements officiels de sécurité du plateau.", correct:'nadia' },
        { id:'corde', title:'Corde de rideau manquante', preview:"Une longueur de corde manque au tableau de manœuvre...", text:"Une longueur de corde manque au tableau de manœuvre du rideau principal ; une fibre similaire a été retrouvée sur le cou de la victime.", correct:'nadia' },
        { id:'billet_menace', title:'Note manuscrite menaçante', preview:"« Je sais ce que tu as fait... »", text:"Trouvée dans la loge : « Je sais ce que tu as fait. Le conseil sera informé demain matin. » Rédigée de la main du directeur.", correct:'nadia' },
        { id:'temoin_coulisses', title:'Témoignage d\'un machiniste', preview:"Une silhouette sortant précipitamment de la loge...", text:"Un machiniste a vu quelqu'un sortir précipitamment de la loge peu après 21h35, en tenue sombre de régie.", correct:'nadia' },
        { id:'agenda_directeur', title:'Agenda du directeur', preview:"Un rendez-vous noté « sécurité plateau, urgent »...", text:"L'agenda du directeur indique : « 21h30 — N.C. — sécurité plateau, urgent. »", correct:'nadia' },
        { id:'parfum', title:'Trace de parfum au jasmin', preview:"Un parfum persistant, mais dont l'origine reste incertaine...", text:"Un parfum de jasmin flotte encore dans la loge. Il ne correspond à aucun produit utilisé par les comédiens.", correct:'nadia' },
        { id:'temoins_scene', title:'Equipe technique', preview:"Toute l'équipe technique affirme...", text:"Toute l'équipe technique confirme qu'Élise Dumont était avec la maquilleuse au moment exact des faits.", correct:'elise' },
        { id:'cameras_couloir', title:'Caméra du couloir', preview:"Un enregistrement vidéo de la loge d'Antoine...", text:"La caméra de surveillance du couloir montre Antoine Brel dans sa loge en train de se préparer, sans interruption durant tout l'entracte.", correct:'antoine' },
        { id:'appel_telephonique', title:'Relevé téléphonique', preview:"Un appel international au moment des faits...", text:"Le relevé téléphonique place Marc-Étienne Roy en communication avec un investisseur à Londres pendant vingt minutes, couvrant l'heure du crime.", correct:'marc' },
        { id:'billet_restaurant', title:'Reçu de restaurant', preview:"Une addition datée et horodatée...", text:"Un reçu de restaurant atteste que Julien Verne dînait à l'autre bout de la ville au moment des faits.", correct:'julien' },
        { id:'pointeuse', title:'Registre d\'accès', preview:"Un badge désactivé depuis le licenciement...", text:"Le registre d'accès du théâtre montre que le badge de Sacha Lenoir a été désactivé le jour de son licenciement ; aucun passage depuis.", correct:'sacha' }
      ],
      comboClues:[
        { triggers:['agenda_directeur','billet_menace'], id:'motif_confirme', title:'Recoupement des dates', correct:'nadia', preview:"Les deux documents concordent parfaitement...", text:"Le rendez-vous noté dans l'agenda coïncide exactement avec la date de la note manuscrite : le directeur avait prévu de confronter Nadia le soir même." },
        { triggers:['rapport_securite','corde'], id:'expertise_corde', title:'Expertise technique', correct:'nadia', preview:"Le lot de corde identifié avec précision...", text:"La corde manquante provient du même lot que celui utilisé pour les manœuvres de rideau, dont Nadia Cohen avait la responsabilité exclusive." },
        { triggers:['parfum','temoin_coulisses'], id:'parfum_identifie', title:'Identification du parfum', correct:'nadia', preview:"Un produit réservé au personnel technique...", text:"Le service technique confirme que ce parfum est distribué en interne uniquement au personnel de régie. Nadia Cohen en porte quotidiennement." }
      ],
      weapons:['Corde de rideau','Trophée de bronze','Corde à piano','Poison','Couteau','Coup violent à la tête'],
      motives:['Vengeance / réputation','Étouffer un scandale','Rivalité artistique','Argent / production','Jalousie amoureuse','Chantage'],
      solution:{ suspect:'nadia', weapon:'Corde de rideau', motive:'Étouffer un scandale' },
      resolutionText:"Nadia Cohen avait falsifié un rapport de sécurité après un accident qui avait failli blesser une actrice. Laurent Ferrand l'avait découvert et s'apprêtait à en informer le conseil le lendemain matin. Pour l'en empêcher, elle l'a étranglé avec la corde de rideau pendant l'entracte. Le parfum, la corde manquante et la note menaçante le confirment."
    },

    {
      id:'vignoble', tab:'Dossier n° 2013-167', title:'Vendanges Rouges',
      victimLine:"Victime : Henri Clairval, propriétaire du Domaine de Clairval, effondré lors de la dégustation des vendanges, empoisonné à la digitaline.",
      teaser:"Un vigneron s'effondre lors de la dégustation des vendanges. Le vin qu'il aimait tant a eu raison de lui.",
      difficulty:"Moyen", totalSeconds:480, maxAttempts:3,
      suspects:[
        { id:'beatrice', name:'Béatrice Clairval', role:'Épouse', bio:'Second mariage ; principale bénéficiaire de l\'assurance-vie.', color:'#8a4b6b', statement:"« Je supervisais le service en cuisine avec cinq employés. Je n'ai jamais quitté la pièce. »" },
        { id:'theo', name:'Théo Clairval', role:'Fils aîné', bio:'En désaccord total sur la vente du domaine à un groupe étranger.', color:'#4b6b8a', statement:"« J'étais parmi les invités pendant la dégustation, comme tout le monde. »" },
        { id:'manon', name:'Manon Clairval', role:'Fille cadette, œnologue', bio:'Mise à l\'écart des décisions malgré ses diplômes.', color:'#8a6b3f', statement:"« J'étais au chai, en train de vérifier les fûts. Je n'ai rien vu. »" },
        { id:'gregoire', name:'Grégoire Simonet', role:'Associé investisseur', bio:'Pressé de vendre pour récupérer sa mise.', color:'#4b8a5b', statement:"« J'étais au téléphone avec mon banquier pendant toute la dégustation. »" },
        { id:'clara', name:'Clara Vidal', role:'Sommelière', bio:'Liaison amoureuse récemment rompue avec la victime.', color:'#8a4b4b', statement:"« Je servais les tables, comme d'habitude. Demandez aux clients. »" },
        { id:'paul', name:'Paul Ferreira', role:'Voisin viticulteur', bio:'Vieux conflit de bornage avec la famille Clairval.', color:'#5b4b8a', statement:"« Je travaillais sur mes propres terres ce soir-là, loin du domaine. »" }
      ],
      baseEvidence:[
        { id:'verre_analyse', title:'Analyse du verre de dégustation', preview:"Des traces de digitaline dans le fond du verre...", text:"Des traces de digitaline ont été retrouvées dans le fond du verre d'Henri, absentes de tous les autres verres servis ce soir-là.", correct:'theo' },
        { id:'digitale_jardin', title:'Plants de digitale taillés', preview:"Des fleurs récemment coupées, jamais récoltées d'habitude...", text:"Plusieurs fleurs de digitale pourpre, cultivées pour l'ornement du jardin, ont été récemment coupées — chose inhabituelle.", correct:'theo' },
        { id:'contrat_vente', title:'Projet de contrat de vente', preview:"70% du domaine cédés à un groupe étranger...", text:"Un contrat prêt à être signé le lendemain matin cède 70% du domaine à un groupe étranger, malgré l'opposition de la famille.", correct:'theo' },
        { id:'dispute_temoin', title:'Témoignage d\'un ouvrier', preview:"« Tu détruis tout ce qu'on a construit »...", text:"Un ouvrier viticole a entendu Théo crier à son père, la veille du festival : « Tu détruis tout ce qu'on a construit. »", correct:'theo' },
        { id:'gants_terre', title:'Gants tachés', preview:"Des résidus végétaux correspondant à la digitale...", text:"Des gants tachés de terre et de sève ont été retrouvés dans la remise, avec des résidus végétaux correspondant à la digitale.", correct:'theo' },
        { id:'testament', title:'Testament révisé', preview:"Une majorité des parts en cas de décès avant la vente...", text:"Béatrice hériterait de la majorité des parts du domaine si Henri venait à mourir avant la signature du contrat de vente.", correct:'beatrice' },
        { id:'facture_gregoire', title:'Relance d\'huissier', preview:"Une dette importante à rembourser d'urgence...", text:"Grégoire Simonet fait l'objet d'une relance d'huissier pour une dette importante, qu'il espérait rembourser grâce à la vente du domaine.", correct:'gregoire' },
        { id:'temoins_cuisine', title:'Témoins de cuisine', preview:"Cinq employés confirment sa présence continue...", text:"Cinq employés confirment que Béatrice Clairval a supervisé le service en cuisine sans interruption durant toute la dégustation.", correct:'beatrice' },
        { id:'video_chai', title:'Caméra du chai', preview:"Un enregistrement montre Manon loin de la tente...", text:"La caméra de surveillance du chai montre Manon Clairval en train de vérifier les fûts pendant toute l'heure du service.", correct:'manon' },
        { id:'appel_banque', title:'Relevé d\'appel bancaire', preview:"Une communication avec son banquier au moment des faits...", text:"Le relevé d'appel place Grégoire Simonet en communication avec son banquier au moment exact des faits.", correct:'gregoire' },
        { id:'temoins_clients', title:'Témoins clients', preview:"Plusieurs tables confirment son service continu...", text:"Plusieurs clients confirment que Clara Vidal servait activement leur table pendant tout le service, sans interruption.", correct:'clara' },
        { id:'gps_tracteur', title:'GPS du tracteur', preview:"Une position à trois kilomètres du domaine...", text:"Le GPS du tracteur de Paul Ferreira indique qu'il travaillait sur ses propres terres, à trois kilomètres, durant toute la soirée.", correct:'paul' }
      ],
      comboClues:[
        { triggers:['digitale_jardin','gants_terre'], id:'empreintes_gants', title:'Analyse des gants', correct:'theo', preview:"Des empreintes partielles identifiées...", text:"Des empreintes partielles relevées sur les gants correspondent à celles de Théo Clairval, comparées à un verre qu'il a manipulé plus tôt dans la soirée." },
        { triggers:['contrat_vente','dispute_temoin'], id:'mobile_confirme', title:'Recoupement du mobile', correct:'theo', preview:"Les dates coïncident parfaitement...", text:"La dispute rapportée par l'ouvrier a eu lieu le jour même où le contrat de vente a été finalisé, confirmant l'urgence ressentie par Théo." },
        { triggers:['verre_analyse','testament'], id:'ecart_beatrice', title:"Note de l'enquêteur", correct:'beatrice', preview:"Un mobile financier réel, mais aucune opportunité...", text:"Bien que Béatrice hérite en cas de décès, elle n'a jamais quitté la cuisine ce soir-là : le mobile financier ne suffit pas face à l'absence totale d'opportunité." }
      ],
      weapons:['Poison (digitaline)','Statuette','Corde','Couteau','Coup à la tête','Arme à feu'],
      motives:['Empêcher une vente / héritage familial','Vengeance amoureuse','Dettes financières','Rivalité professionnelle','Jalousie','Vengeance de voisinage'],
      solution:{ suspect:'theo', weapon:'Poison (digitaline)', motive:'Empêcher une vente / héritage familial' },
      resolutionText:"Théo Clairval refusait que son père vende le domaine familial à un groupe étranger. Il a récolté de la digitale dans le jardin et empoisonné le vin de dégustation de son père pour empêcher la signature du contrat prévue le lendemain. Les plants coupés, les gants tachés et l'analyse du verre le confirment. Béatrice avait un mobile financier réel, mais aucune opportunité : elle n'a jamais quitté la cuisine."
    },

    {
      id:'belmont', tab:'Dossier n° 2004-201', title:'Nuit Blanche à l\'Hôtel Belmont',
      victimLine:"Victime : Édouard Belmont, propriétaire de l'Hôtel Belmont, retrouvé mort dans la suite présidentielle juste après le compte à rebours de minuit.",
      teaser:"Minuit sonne à l'Hôtel Belmont. Le feu d'artifice illumine le ciel — et couvre un meurtre commis dans la suite présidentielle. Une longue enquête, huit suspects, un vrai casse-tête.",
      difficulty:"Difficile", totalSeconds:720, maxAttempts:4,
      suspects:[
        { id:'veronique', name:'Véronique Belmont', role:'Épouse', bio:'Ignorait que son mari prévoyait de la quitter et de revoir son testament.', color:'#8a4b6b', statement:"« Je dansais au centre de la salle de bal quand le feu d'artifice a commencé. Il y a des dizaines de témoins. »" },
        { id:'hugo', name:'Hugo Belmont', role:'Fils, directeur financier', bio:'Gère les finances de l\'hôtel ; son père venait de commander un audit surprise.', color:'#4b6b8a', statement:"« J'étais dans la salle de bal avec les autres invités pour le compte à rebours, comme tout le monde. »" },
        { id:'diane', name:'Diane Roussel', role:'Directrice générale', bio:'Voulait racheter l\'hôtel ; Édouard refusait catégoriquement de vendre.', color:'#8a6b3f', statement:"« Je supervisais le poste de sécurité au rez-de-chaussée pendant tout le feu d'artifice. »" },
        { id:'karim', name:'Karim Lasry', role:'Chef cuisinier étoilé', bio:'Menacé de renvoi après une intoxication alimentaire qu\'Édouard voulait rendre publique.', color:'#4b8a5b', statement:"« J'étais en cuisine à superviser le buffet de minuit, je n'ai pas quitté mon poste. »" },
        { id:'odile', name:'Odile Ferrand', role:'Femme de chambre en chef', bio:'A découvert le corps ; connaissait des secrets qu\'elle taisait moyennant compensation.', color:'#8a4b4b', statement:"« Je m'occupais du troisième étage. Je ne suis montée à la suite présidentielle qu'à 00h20, pour le service du soir. »" },
        { id:'thibault', name:'Thibault Meyer', role:'Investisseur', bio:'Offre de rachat hostile rejetée sèchement par Édouard la veille.', color:'#5b4b8a', statement:"« J'étais en visioconférence avec des associés à New York au moment des faits. »" },
        { id:'camille', name:'Camille Aubert', role:'Chanteuse de la soirée', bio:'Ancienne maîtresse d\'Édouard, récemment quittée sans ménagement.', color:'#a3691f', statement:"« J'étais sur scène à chanter le compte à rebours devant tous les invités. »" },
        { id:'bernard', name:'Bernard Fontaine', role:'Avocat de la famille', bio:'Chargé de réviser le testament dans les jours suivants.', color:'#3f7a6b', statement:"« Je discutais avec le concierge à la réception durant tout le feu d'artifice. »" }
      ],
      baseEvidence:[
        { id:'registre_audit', title:'Registre d\'audit financier', preview:"Un détournement de plus de 340 000 euros...", text:"Un audit interne, commandé discrètement par Édouard une semaine plus tôt, révèle un détournement de plus de 340 000 euros depuis le compte fournisseurs de l'hôtel, tous les virements portant la signature électronique d'Hugo Belmont.", correct:'hugo' },
        { id:'lettre_avocat', title:'Lettre inachevée à l\'avocat', preview:"« Je veux qu'Hugo soit retiré du conseil dès le 2 janvier... »", text:"Une lettre inachevée d'Édouard adressée à Bernard Fontaine : « Je veux qu'Hugo soit retiré du conseil d'administration dès le 2 janvier, et qu'une plainte soit déposée contre lui. »", correct:'hugo' },
        { id:'seringue', title:'Seringue vide', preview:"Des traces d'insuline à très forte concentration...", text:"Une seringue vide, portant des traces d'insuline à très forte concentration, a été retrouvée dans la corbeille de la salle de bain attenante à la suite.", correct:'hugo' },
        { id:'temoin_couloir', title:'Témoignage d\'un groom', preview:"Une entrée dans la suite juste avant minuit...", text:"Un groom affirme avoir vu Hugo Belmont entrer dans la suite présidentielle juste avant le compte à rebours, prétextant vouloir souhaiter la bonne année à son père en privé.", correct:'hugo' },
        { id:'carte_acces', title:'Registre des cartes d\'accès', preview:"Un déverrouillage à 23h58, puis à 00h04...", text:"Le registre électronique des cartes d'accès montre que la carte d'Hugo Belmont a déverrouillé la porte de la suite à 23h58, puis à nouveau à 00h04 pour en ressortir.", correct:'hugo' },
        { id:'gants_latex', title:'Gants en latex froissés', preview:"Retrouvés dans une poche de smoking...", text:"Une paire de gants en latex, de la taille utilisée dans les cuisines de l'hôtel, a été retrouvée froissée dans une poche du smoking d'Hugo.", correct:'hugo' },
        { id:'medecin_legiste', title:'Rapport du médecin légiste', preview:"Une hypoglycémie sévère et un point d'injection récent...", text:"L'autopsie révèle une hypoglycémie sévère incompatible avec le profil médical habituel du défunt, associée à un point d'injection récent au creux du bras, dissimulé sous la manche du smoking.", correct:'hugo' },
        { id:'temoins_bal', title:'Témoins de la salle de bal', preview:"Des dizaines d'invités présents au même moment...", text:"Des dizaines d'invités confirment que Véronique Belmont dansait au centre de la salle de bal au moment du feu d'artifice, photographiée par plusieurs convives.", correct:'veronique' },
        { id:'poste_securite', title:'Registre du poste de sécurité', preview:"Une présence confirmée par deux agents...", text:"Diane Roussel supervisait le poste de sécurité au rez-de-chaussée durant tout le feu d'artifice, aux côtés de deux agents qui le confirment.", correct:'diane' },
        { id:'cameras_cuisine', title:'Caméras des cuisines', preview:"Une supervision ininterrompue du buffet de minuit...", text:"Les caméras des cuisines montrent Karim Lasry supervisant le dressage du buffet de minuit sans interruption durant toute la période critique.", correct:'karim' },
        { id:'badge_etage3', title:'Badge du troisième étage', preview:"Plusieurs étages sous la suite présidentielle...", text:"Le badge d'Odile Ferrand indique qu'elle s'occupait du troisième étage au moment des faits, à plusieurs étages de la suite présidentielle.", correct:'odile' },
        { id:'appel_visio', title:'Journal de visioconférence', preview:"Un appel professionnel avec New York...", text:"Un journal de connexion place Thibault Meyer en visioconférence avec des associés new-yorkais au moment exact du décès.", correct:'thibault' },
        { id:'temoins_scene_hotel', title:'Témoins sur scène', preview:"Toute la salle l'a vue chanter le compte à rebours...", text:"Camille Aubert interprétait la chanson du compte à rebours sur scène, devant l'ensemble des invités, au moment des faits.", correct:'camille' },
        { id:'reception_hotel', title:'Registre de la réception', preview:"Une conversation avec le concierge, confirmée...", text:"Le registre de la réception et le témoignage du concierge indiquent que Bernard Fontaine discutait avec lui au rez-de-chaussée durant tout le feu d'artifice.", correct:'bernard' },
        { id:'testament_original', title:'Testament original', preview:"Une légataire universelle qui l'ignorait...", text:"Le testament actuel désigne Véronique comme légataire universelle, un fait qu'elle ignorait selon ses proches.", correct:'veronique' },
        { id:'offre_rachat', title:'Offre de rachat hostile', preview:"Une proposition rejetée sèchement la veille...", text:"Une offre de rachat hostile déposée par Thibault Meyer a été rejetée sèchement par Édouard la veille, par écrit, mettant fin à des mois de négociation.", correct:'thibault' }
      ],
      comboClues:[
        { triggers:['carte_acces','temoin_couloir'], id:'chronologie_confirmee', title:'Recoupement horaire', correct:'hugo', preview:"Une concordance à la minute près...", text:"Le témoignage du groom et le registre des cartes d'accès concordent à la minute près : Hugo Belmont est resté enfermé avec son père durant exactement six minutes, le temps du feu d'artifice." },
        { triggers:['registre_audit','lettre_avocat'], id:'mobile_confirme_hugo', title:'Le double mobile', correct:'hugo', preview:"Prison et exclusion du conseil, sans échappatoire...", text:"Le détournement de fonds et la lettre confirment qu'Hugo risquait à la fois la prison et l'exclusion du conseil dès le 2 janvier — un ultimatum sans échappatoire possible." },
        { triggers:['seringue','medecin_legiste'], id:'expertise_toxico', title:'Expertise toxicologique', correct:'hugo', preview:"Une concentration qui correspond exactement à la dose fatale...", text:"La concentration d'insuline retrouvée dans la seringue correspond exactement à la dose responsable du décès, selon le rapport toxicologique complémentaire." },
        { triggers:['gants_latex','carte_acces'], id:'absence_empreintes', title:'Absence d\'empreintes', correct:'hugo', preview:"Une précaution que peu d'invités auraient prise spontanément...", text:"L'absence totale d'empreintes sur la poignée de la porte et sur le verre du défunt s'explique par le port de gants — une précaution que peu d'invités auraient pensé à prendre spontanément, un soir de fête." },
        { triggers:['testament_original','offre_rachat'], id:'ecart_suspects_belmont', title:'Note de synthèse', correct:'veronique', preview:"Deux mobiles réels, mais aucune opportunité...", text:"Ni Véronique ni Thibault n'avaient l'opportunité d'agir : l'une dansait sous les yeux de dizaines de témoins, l'autre était en visioconférence à l'autre bout du monde au moment exact des faits." }
      ],
      weapons:["Overdose d'insuline",'Coup à la tête','Arme à feu','Poison alimentaire','Corde','Chute provoquée','Noyade dans la baignoire','Étouffement'],
      motives:['Dissimuler un détournement de fonds','Héritage / testament','Rachat hostile de l\'hôtel','Vengeance amoureuse','Chantage','Rivalité professionnelle','Réputation / scandale public'],
      solution:{ suspect:'hugo', weapon:"Overdose d'insuline", motive:'Dissimuler un détournement de fonds' },
      resolutionText:"Hugo Belmont détournait des fonds de l'hôtel depuis des mois pour couvrir des dettes personnelles. Lorsque son père a commandé un audit et rédigé une lettre exigeant son exclusion du conseil dès le 2 janvier, Hugo a compris qu'il perdrait tout — sa position, sa fortune, et probablement sa liberté. Profitant du vacarme du feu d'artifice de minuit, il s'est introduit dans la suite présidentielle et a injecté à son père une dose massive d'insuline, maquillant la scène en malaise cardiaque. Le registre des cartes d'accès, le témoignage du groom, la seringue retrouvée et l'expertise toxicologique convergent tous vers lui. Véronique et Thibault, malgré des mobiles réels, avaient des alibis solides et vérifiés par de nombreux témoins."
    },

    {
      id:'malediction_vane', tab:'Dossier n° 1989-924', title:"La Malédiction des Vane",
      victimLine:"Victimes : Sir Arthur Vane (retrouvé pendu) & Lady Eleanor Vane (empoisonnée à la ricine) dans la tour ouest du manoir abandonné de Blackwood Hall, à minuit pile.",
      teaser:"UN CRIME IMPOSSIBLE ! Deux victimes, deux modes opératoires distincts, une pièce scellée par la neige sans aucune empreinte extérieure, un alibi croisé imparable et un journal de cryptogrammes codés. Une enquête machiavélique aux fausses pistes mortelles.",
      difficulty:"Extrême (Expert)", totalSeconds:240, maxAttempts:1,
      suspects:[
        { id:'gabriel', name:'Gabriel Vane', role:'Frère banni', bio:'Ancien chimiste, spolié de l\'héritage, vit en ermite dans les bois.', color:'#8a4b6b', statement:"« J'étais bloqué par la tempête de neige dans ma cabane à 5 km d'ici. Le garde-chasse m'a vu par la fenêtre à 23h30 et 00h30. »" },
        { id:'evangeline', name:'Évangéline Frost', role:'Romancière / Médium', bio:'Invité mystérieuse prétendant communiquer avec les esprits de la tour.', color:'#4b6b8a', statement:"« À minuit, nous tenions une séance de spiritisme dans le grand salon du rez-de-chaussée. Nous nous tenions tous la main ! »" },
        { id:'dr_bennett', name:'Dr. Alistair Bennett', role:'Médecin de famille', bio:'A prescrit les calmants de Lady Eleanor. Très endetté.', color:'#8a6b3f', statement:"« J'étais assis à côté d'Évangéline pendant toute la séance. Je n'ai pas quitté la table une seule seconde entre 23h45 et 00h15. »" },
        { id:'charles', name:'Charles Vance', role:'Notaire de la famille', bio:'Gestionnaire de la fortune des Vane depuis 20 ans.', color:'#4b8a5b', statement:"« Sir Arthur m'a demandé de brûler son nouveau testament juste avant la séance. J'exécutais ses ordres dans la cheminée du salon. »" },
        { id:'clara', name:'Clara Higgins', role:'Gouvernante', bio:'Fidèle servante ayant accès à toutes les clefs et conduits du manoir.', color:'#8a4b4b', statement:"« J'ai apporté le thé au salon à 23h50. La porte de la tour ouest était verrouillée de l'intérieur par le verrou de fer depuis 22h. »" }
      ],
      baseEvidence:[
        { id:'neige_intacte', title:'Manteau de neige vierge', preview:"Aucune trace de pas autour de la tour ouest...", text:"La neige fraîche est tombée continuellement de 22h00 à 01h00. Aucune trace de pas ne mène ou ne sort de la tour ouest. La seule fenêtre est située à 15 mètres de hauteur.", correct:'clara' },
        { id:'verrou_fer', title:'Verrou de fer intérieur', preview:"Un système de fermeture à glissière en fonte...", text:"La porte massive de la tour était verrouillée de l'intérieur. Il a fallu enfoncer la porte. Le verrou ne peut pas être manipulé de l'extérieur par une ficelle en raison de sa bride recourbée.", correct:'clara' },
        { id:'horloge_coucou', title:'Mécanisme d\'horloge trafiqué', preview:"Des engrenages modifiés raccordés au conduit de cheminée...", text:"Dans les combles au-dessus de la tour, un câble d'acier très fin est relié aux engrenages du grand coucou de la tour. À minuit pile, le déclenchement du poids de l'horloge libère une tension de 80kg.", correct:'dr_bennett' },
        { id:'ricine_flacon', title:'Récipient de Ricine purifiée', preview:"Retrouvé camouflé dans la doublure d'une trousse médicale...", text:"Une dose mortelle d'extrait de graines de ricin a été retrouvée dissoute. La ricine met exactement 2 heures à paralyser le système respiratoire après ingestion.", correct:'dr_bennett' },
        { id:'testament_brule', title:'Fragments de testament', preview:"Des morceaux de papier calcinés dans la cheminée...", text:"Le testament résiduel révèle que Sir Arthur léguait toute sa fortune à l'hôpital du Dr. Bennett si Eleanor et lui mouraient le même jour sans héritier.", correct:'dr_bennett' },
        { id:'journal_crypte', title:'Journal intime de Sir Arthur', preview:"Des lignes de symboles alchimiques incompréhensibles...", text:"Le journal contient un code : « B.A. - 22h00 - Le remède accepté. Le piège est tendu pour l'esprit à minuit. »", correct:'dr_bennett' },
        { id:'the_ricine', title:'Tasse de thé aromatisé', preview:"Restes de thé à la bergamote bus vers 22h00...", text:"L'analyse révèle que Lady Eleanor a ingéré la ricine dans son thé du soir à 22h00. À minuit, elle était déjà incapable de bouger ou de crier.", correct:'dr_bennett' },
        { id:'cabane_ombre', title:'Rapport du garde-chasse', preview:"Le garde-chasse a vu une silhouette à la fenêtre...", text:"Le garde-chasse confirme avoir vu un homme de taille moyenne avec un manteau enfiler une bûche dans le poêle de la cabane de Gabriel à 23h30 et 00h30.", correct:'gabriel' }
      ],
      comboClues:[
        { triggers:['horloge_coucou','verrou_fer'], id:'pendaison_auto', title:'Mécanisme du faux suicide', correct:'dr_bennett', preview:"Sir Arthur n'a pas été pendu par une personne présente...", text:"Le câble d'acier relié à l'horloge traversait le conduit d'aération (trop étroit pour un homme, mais suffisant pour le câble). À minuit, le mécanisme de l'horloge a hissé Sir Arthur. Personne ne se trouvait dans la pièce à minuit !" },
        { triggers:['ricine_flacon','the_ricine'], id:'timing_ricine', title:'L\'alibi de minuit détruit', correct:'dr_bennett', preview:"Le meurtre n'a pas eu lieu pendant la séance de spiritisme...", text:"Parce que la ricine met 2 heures à agir, le poison a été versé à 22h00 lors de la consultation médicale du Dr. Bennett. Son alibi durant la séance de spiritisme à minuit est un leurre calculé !" },
        { triggers:['testament_brule','journal_crypte'], id:'mobile_bennett', title:'Chantage et Héritage', correct:'dr_bennett', preview:"'B.A.' signifie Bennett Alistair...", text:"Bennett avait convaincu Sir Arthur d'absorber un 'remède expérimental' à 22h tout en truquant l'horloge de la tour lors de sa visite médicale préalable. Le mobile ultime : récupérer les fonds pour payer ses dettes de jeu." }
      ],
      weapons:['Mécanisme d\'horloge & Ricine','Corde & Cyanure','Fusil de chasse','Poignard & Arsenic','Gaz asphyxiant','Strychnine'],
      motives:['Captation d\'héritage & Dettes','Peur du chantage','Vengeance familiale','Démence','Rivalité amoureuse','Fanatisme spirituel'],
      solution:{ suspect:'dr_bennett', weapon:'Mécanisme d\'horloge & Ricine', motive:'Captation d\'héritage & Dettes' },
      resolutionText:"LE CRIME IMPOSSIBLE ÉLUCIDÉ : Le Dr. Alistair Bennett est le cerveau machiavélique ! Utilisant sa visite médicale de 22h00, il a fait boire de la ricine à Lady Eleanor (qui est morte étouffée vers minuit dans la pièce fermée) et a drogué Sir Arthur. Durant cette même visite, Bennett a accroché le câble dissimulé dans le conduit d'aération à Sir Arthur. Le câble était relié au mécanisme du grand coucou dans les combles. À minuit pile, le déclenchement de l'horloge a pendu Sir Arthur automatiquement ! Bennett s'est ensuite créé un alibi inattaquable en participant publiquement à la séance de spiritisme à minuit pile au rez-de-chaussée. Une machination diabolique démasquée par la médecine légale et la mécanique !"
    },

    {
      id:'alchimie', tab:'Dossier n° 2019-219', title:'Le Protocole Hermès',
      victimLine:"Victime : Dr. Victor Lemaire, directeur de recherche en pharmacologie, retrouvé asphyxié dans la salle propre du laboratoire le 3 novembre vers 22h15.",
      teaser:"Une coupure de courant de 8 minutes dans un laboratoire de haute sécurité. À la reprise de l'électricité, le directeur est mort. Le système d'air a été manipulé de l'intérieur.",
      difficulty:"Difficile", totalSeconds:360, maxAttempts:3,
      suspects:[
        { id:'claire', name:'Dr. Claire Delcroix', role:'Chercheuse associée', bio:'Sa publication majeure a été signée par la victime à sa place.', color:'#8a4b6b', statement:"« J'étais bloquée dans l'ascenseur B pendant toute la durée de la panne de courant. »" },
        { id:'etienne', name:'Étienne Moreau', role:'Responsable sécurité', bio:'Accusé de négligence grave lors d\'une inspection le mois dernier.', color:'#4b6b8a', statement:"« J'étais au poste central pour tenter de réinitialiser le disjoncteur principal. »" },
        { id:'sarah', name:'Sarah Benali', role:'Doctorante', bio:'Invention brevetable volée par la victime la semaine passée.', color:'#8a6b3f', statement:"« J'étais dans la salle de repos à attendre que la lumière revienne avec mes collègues. »" },
        { id:'arthur', name:'Arthur Vance', role:'Représentant d\'investisseurs', bio:'Menaçait de couper les crédits du projet si les résultats tardaient.', color:'#4b8a5b', statement:"« Je passais un appel dans ma voiture sur le parking au moment du black-out. »" },
        { id:'denis', name:'Denis Vaneck', role:'Technicien de maintenance', bio:'Récemment averti pour vol de matériel informatique dans les réserves.', color:'#8a4b4b', statement:"« Je faisais ma ronde dans le sous-sol technique quand les plombs ont sauté. »" },
        { id:'valerie', name:'Valérie Lemaire', role:'Épouse, administratrice', bio:'Découverte récente d\'un transfert de fonds secret vers une banque offshore.', color:'#5b4b8a', statement:"« J'étais chez moi à préparer le dossier fiscal du cabinet, à 15 km d'ici. »" }
      ],
      baseEvidence:[
        { id:'registre_sas', title:'Registre du sas de sécurité', preview:"Une ouverture manuelle forcée enregistrée durant le black-out...", text:"Le registre de sécurité de secours indique que la porte du sas 3 a été déverrouillée avec le badge de Denis Vaneck à 22h09, au cœur de la panne.", correct:'denis' },
        { id:'bouteille_gaz', title:'Bonbonne de cyanure de vinyle', preview:"Une valve ouverte manuellement dans le circuit d'air...", text:"Une valve secondaire d'injection de gaz toxique a été ouverte avec une clé à molette spécifique, déviant le produit directement vers la salle propre.", correct:'denis' },
        { id:'cle_outil', title:'Clé de réglage tachée d\'huile', preview:"Retrouvée dans le bac à graisse du sous-sol...", text:"Une clé de réglage de valve a été retrouvée camouflée dans le sous-sol. Les empreintes partielles de Denis Vaneck y sont identifiées.", correct:'denis' },
        { id:'badge_recupere', title:'Badge d\'accès volé', preview:"Un signalement de perte daté du matin même...", text:"Un rapport interne montre que Denis Vaneck avait déclaré son badge perdu le matin même, alors que la vidéo du parking le montre en train de l'utiliser à 21h50.", correct:'denis' },
        { id:'brouillon_reclamation', title:'Courrier de dénonciation', preview:"Une lettre d'alerte adressée à l'Ordre des chimistes...", text:"Le Dr. Lemaire avait rédigé une lettre révélant un trafic de réactifs chimiques revendus au marché noir, désignant explicitement Denis Vaneck.", correct:'denis' },
        { id:'ascenseur_log', title:'Interphone d\'ascenseur', preview:"Un signal de détresse validé à 22h08...", text:"Le journal d'interphone de l'ascenseur B confirme qu'un occupant (Dr. Claire Delcroix) a appelé la centrale de sécurité à 22h08, coincée entre deux étages.", correct:'claire' },
        { id:'cameras_poste', title:'Vidéo du poste de sécurité', preview:"Un enregistrement thermique infrarouge...", text:"La caméra thermique sur batterie de secours montre Étienne Moreau devant le panneau électrique principal durant les 8 minutes du black-out.", correct:'etienne' },
        { id:'temoins_repos', title:'Déclarations des chercheurs', preview:"Trois personnes présentes dans la salle de repos...", text:"Deux stagiaires attestent que Sarah Benali n'a pas quitté la salle de repos pendant toute la durée de la coupure de courant.", correct:'sarah' },
        { id:'borne_relais', title:'Borne 4G du parking', preview:"Relevé d'antenne relais pour la ligne mobile...", text:"Les données d'antenne relais confirment l'émission et la réception de données depuis la voiture d'Arthur Vance entre 22h05 et 22h20.", correct:'arthur' },
        { id:'peage_autoroute', title:'Péage et caméras LAPI', preview:"Le véhicule identifié à 22h10...", text:"La caméra du péage autoroutier atteste du passage du véhicule de Valérie Lemaire à 22h10, confirmant son trajet loin du laboratoire.", correct:'valerie' }
      ],
      comboClues:[
        { triggers:['registre_sas','badge_recupere'], id:'faux_vol_badge', title:'Fausse déclaration', correct:'denis', preview:"La fausse déclaration de perte tombe à l'eau...", text:"En déclarant son badge perdu le matin même, Denis espérait détourner les soupçons lors de l'ouverture du sas pendant le black-out, mais la vidéo du parking le trahit." },
        { triggers:['bouteille_gaz','cle_outil'], id:'empreintes_ouvrages', title:'Sabotage prémédité', correct:'denis', preview:"L'outil et la valve concordent parfaitement...", text:"La clé de réglage trouvée dans la graisse correspond exactement à l'écrou de la valve de cyanure. Les traces d'huile sur la veste de travail de Denis confirment sa manipulation." },
        { triggers:['brouillon_reclamation','cle_outil'], id:'mobile_trafic', title:'Peur du scandale pénitentiaire', correct:'denis', preview:"Un motif d'urgence absolue...", text:"La découverte du trafic par le directeur menaçait Denis de poursuites pénales immédiates. La manipulation de la ventilation était son ultime recours pour l'amener au silence." }
      ],
      weapons:['Gaz toxique (cyanure de vinyle)','Poison volatil','Injection létale','Arrêt de la ventilation','Coup violent à la tête','Électrocution'],
      motives:['Dissimuler un trafic illégal / revente','Vol de brevet / recherche','Usurpation de paternité scientifique','Chantage','Vengeance personnelle','Rupture d\'investissement'],
      solution:{ suspect:'denis', weapon:'Gaz toxique (cyanure de vinyle)', motive:'Dissimuler un trafic illégal / revente' },
      resolutionText:"Denis Vaneck revendait sous le manteau des produits chimiques coûteux prélevés dans les stocks du laboratoire. Informé, le Dr. Lemaire s'apprêtait à le dénoncer aux autorités dès le lendemain. Profitant d'une maintenance du réseau électrique, Vaneck a coupé le disjoncteur général, utilisé son badge (qu'il avait feint d'avoir perdu le matin même) pour s'introduire dans le sas et dévier une conduite de cyanure de vinyle dans le circuit d'air de la salle propre. L'empreinte sur la clé de réglage, la vidéo du parking et la fausse déclaration de perte du badge le désignent formellement."
    },
    
    {
      id:'harbor', tab:'Dossier n° 2023-305', title:'Ombres sur le Quai n°9',
      victimLine:"Victime : Gustaf Lindström, magnat de la logistique maritime, retrouvé mort noyé et lesté dans le bassin du port privé, la nuit du 12 au 13 décembre vers 01h30.",
      teaser:"Dix personnes présentes sur un yacht de luxe lors d'une tempête nocturne. Une montre brisée arrêtée à 01h12, mais un rapport d'autopsie troublant. Un vrai casse-tête.",
      difficulty:"Extrême (Expert)", totalSeconds:720, maxAttempts:4,
      suspects:[
        { id:'astrid', name:'Astrid Lindström', role:'Fille cadette', bio:'Écartée du conseil d\'administration pour instabilité financière.', color:'#8a4b6b', statement:"« J'étais dans la cabine VIP 2 à dormir à poings fermés, assommée par le mal de mer. »" },
        { id:'viktor', name:'Viktor Kovar', role:'Capitaine du yacht', bio:'Ancien contrebandier, menacé de licenciement pour faute grave.', color:'#4b6b8a', statement:"« J'étais au poste de pilotage pour surveiller les amarres face à la tempête. »" },
        { id:'elena', name:'Elena Vassiliev', role:'Armatrice rivale', bio:'Pertes colossales suite à un sabotage commercial attribué à la victime.', color:'#8a6b3f', statement:"« Je suis partie du yacht à 00h30. La navette du port m'a déposée au ponton principal. »" },
        { id:'marcus', name:'Dr. Marcus Vance', role:'Médecin personnel', bio:'Prescriptions illégales masquées dans les dossiers médicaux du groupe.', color:'#4b8a5b', statement:"« J'étais dans le petit salon à lire des rapports médicaux jusqu'à 02h00 du matin. »" },
        { id:'solene', name:'Solène Bertrand', role:'Avocate d\'affaires', bio:'A découvert une clause d\'annulation de ses honoraires astronomiques.', color:'#8a4b4b', statement:"« J'étais en appel avec mes collaborateurs à Hong Kong dans le bureau du yacht. »" },
        { id:'karl', name:'Karl Berg', role:'Ancien associé', bio:'Sorti récemment de prison, accuse Gustaf de l\'avoir fait plonger à sa place.', color:'#5b4b8a', statement:"« Je suis resté sur le pont inférieur à fumer. Je n'ai croisé personne. »" },
        { id:'ines', name:'Inès Moreau', role:'Traductrice', bio:'Chantage affectif et financier sur fond de secrets d\'État.', color:'#a3691f', statement:"« J'étais dans ma cabine à traduire les contrats pour la réunion du lendemain. »" },
        { id:'soren', name:'Søren Holm', role:'Directeur des opérations', bio:'Futur PDG désigné si Gustaf venait à disparaître brusquement.', color:'#3f7a6b', statement:"« J'ai quitté la soirée vers 00h45 pour rejoindre l'hôtel du port. Le veilleur m'a vu. »" },
        { id:'yassine', name:'Yassine Benali', role:'Ingénieur naval', bio:'Créancier d\'une lourde dette de propriété intellectuelle non versée.', color:'#6b3f8a', statement:"« J'étais aux machines pour régler un problème de générateur secondaire. »" },
        { id:'claire', name:'Claire Duval', role:'Journaliste', bio:'Infiltrée sous fausse identité pour révéler un scandale d\'évasion fiscale.', color:'#3f8a80', statement:"« J'ai pris des photos du port depuis la jetée extérieure entre 01h00 et 01h30. »" }
      ],
      baseEvidence:[
        { id:'montre_cassee', title:'Montre de luxe arrêtée', preview:"Le cadran est brisé et indique 01h12...", text:"La montre de Gustaf est bloquée à 01h12. Le verre n'a toutefois pas été brisé par de l'eau de mer mais par un choc sec, suggérant une mise en scène.", correct:'karl' },
        { id:'chaine_ancre', title:'Chaîne et maillon lourd', preview:"Des traces de rouille sur le manteau de la victime...", text:"La victime a été coulée au fond du bassin avec un maillon d'ancrage provenant de la réserve du pont inférieur, accessible par la cale de stockage.", correct:'karl' },
        { id:'empreintes_cale', title:'Traces de graisse sur le maillon', preview:"Des empreintes partielles relevées...", text:"Les analyses révèlent des traces de graisse industrielle et l'empreinte de la paume droite de Karl Berg sur le maillon d'ancrage retrouvé sur le corps.", correct:'karl' },
        { id:'cables_coupes', title:'Câble vidéo sectionné', preview:"La caméra du quai 9 a été neutralisée à 00h55...", text:"Le câble reliant la caméra de surveillance du quai au serveur central a été tranché avec une pince de marin retrouvée dans le coffre de Karl Berg.", correct:'karl' },
        { id:'registre_penitencier', title:'Correspondance carcérale', preview:"Des menaces explicites écrites il y a six mois...", text:"Une lettre envoyée par Karl Berg depuis sa cellule de prison : « Quand je sortirai, tu paieras pour chaque jour que j'ai passé dans cette cage à ta place. »", correct:'karl' },
        { id:'autopsie_eau', title:'Analyse pulmonaire du légiste', preview:"Eau douce vs Eau de mer dans les poumons...", text:"L'autopsie révèle que les poumons de la victime contiennent de l'eau douce chlorée (provenant du jacuzzi), prouvant qu'il y est mort assommé avant d'être jeté à la mer.", correct:'karl' },
        { id:'badge_cabine2', title:'Passage cabine VIP 2', preview:"Déverrouillage électronique horodaté...", text:"Le badge d'Astrid Lindström a ouvert la porte de sa cabine à 23h45, sans aucune autre tentative d'ouverture jusqu'au lendemain matin.", correct:'astrid' },
        { id:'log_capitaine', title:'Boîte noire du gouvernail', preview:"Ajustements continus enregistrés...", text:"Le journal de bord électronique de la barre confirme une activité manuelle ininterrompue de Viktor Kovar à la barre de 00h30 à 02h00.", correct:'viktor' },
        { id:'ticket_navette', title:'Horodateur de la navette maritime', preview:"L'embarquement confirmé à la minute près...", text:"Le système automatique du ponton atteste qu'Elena Vassiliev a pris la navette de 00h30, l'éloignant définitivement du yacht.", correct:'elena' },
        { id:'telecom_hk', title:'Journal d\'appel satellite', preview:"Une communication ininterrompue de 45 minutes...", text:"Le relevé d'appel satellite confirme une conversation continue entre Solène Bertrand et son cabinet d'avocats à Hong Kong de 00h40 à 01h25.", correct:'solene' },
        { id:'registre_hotel', title:'Main courante de l\'hôtel du port', preview:"Confirmation écrite et visuelle par le gardien...", text:"Le veilleur de nuit de l'hôtel du port atteste l'arrivée de Søren Holm à 00h50 et sa présence au bar de l'hôtel jusqu'à 02h00.", correct:'soren' },
        { id:'photos_journaliste', title:'Fichiers RAW horodatés', preview:"Une série de clichés de la jetée...", text:"Les cartes mémoire de Claire Duval contiennent 40 clichés avec métadonnées inaltérables prises depuis la jetée extérieure entre 01h00 et 01h30.", correct:'claire' },
        { id:'camera_jacuzzi', title:'Enregistrement caméra privée', preview:"Une mini-caméra orientée vers le pont...", text:"Une mini-caméra installée sur le pont supérieur montre Karl Berg assommer Gustaf près du jacuzzi à 01h00, puis traîner son corps vers le pont inférieur.", correct:'karl' },
        { id:'temoignage_secretaire', title:'Déclaration d\'Inès Moreau', preview:"A aperçu une forme lourde traînée dans l'escalier...", text:"Inès Moreau a déclaré avoir entendu un choc étouffé vers 01h00, puis aperçu un homme grand portant un sac lourd descendre vers la cale.", correct:'karl' },
        { id:'ordonnance_medecin', title:'Carnet du Dr Vance', preview:"Sédatifs à haute dose préparés...", text:"Le Dr. Vance a administré un puissant calmant à Astrid à 23h30 pour son mal de mer, confirmant qu'elle était hors d'état de se lever.", correct:'astrid' },
        { id:'capteurs_moteur', title:'Registre de télémétrie machine', preview:"Changement de pression manuel enregistré...", text:"Le rapport d'intervention technique confirme que Yassine Benali réparait la vanne du générateur de 00h30 à 01h45 sans interruption.", correct:'yassine' }
      ],
      comboClues:[
        { triggers:['montre_cassee','autopsie_eau'], id:'falsification_heure', title:'Faux horodatage du crime', correct:'karl', preview:"La montre a été manipulée volontairement...", text:"L'eau douce trouvée dans les poumons et le choc à sec sur la montre prouvent que Karl Berg a délibérément brisé le cadran à 01h12 après l'avoir noyé dans le jacuzzi pour fausser l'heure du décès." },
        { triggers:['chaine_ancre','empreintes_cale'], id:'materiel_incriminant', title:'Lestage prémédité', correct:'karl', preview:"L'utilisation exclusive du matériel de la réserve...", text:"Seul Karl Berg connaissait l'emplacement de la réserve d'ancres et disposait de la pince pour couper les câbles afin d'agir dans l'obscurité." },
        { triggers:['cables_coupes','camera_jacuzzi'], id:'premeditation_complete', title:'Piège déjoué par la vidéo', correct:'karl', preview:"Une caméra secondaire oubliée...", text:"En coupant les câbles vidéo du quai, Karl pensait avoir effacé toute trace. Il ignorait l'existence de la mini-caméra privée sur le pont supérieur qui a capturé l'agression." },
        { triggers:['registre_penitencier','empreintes_cale'], id:'vengeance_eclatante', title:'Vengeance accomplie', correct:'karl', preview:"Le lien entre la menace et l'acte...", text:"La menace formulée en prison se concrétise : Karl a profité de la soirée sur le yacht pour assouvir sa vengeance en éliminant Gustaf." },
        { triggers:['badge_cabine2','ordonnance_medecin'], id:'innocence_astrid', title:'Mise hors de cause d\'Astrid', correct:'astrid', preview:"Alibi médical et électronique inattaquable...", text:"Le sédatif administré par le docteur et le verrouillage ininterrompu de la porte de sa cabine disculpent totalement Astrid Lindström malgré sa rancœur familiale." }
      ],
      weapons:['Noyade dans le jacuzzi (puis lestage)','Coup violent à la tête','Arme à feu','Poison','Étranglement par fil de fer','Chute provoquée'],
      motives:['Vengeance / Purgatoire carcéral','Héritage','Rachat d\'actions sous contrainte','Chantage','Rivalité commerciale','Dettes d\'argent'],
      solution:{ suspect:'karl', weapon:'Noyade dans le jacuzzi (puis lestage)', motive:'Vengeance / Purgatoire carcéral' },
      resolutionText:"Karl Berg ne s'est jamais remis des années passées en prison pour couvrir les fraudes de Gustaf Lindström. Invité à bord du yacht, il a neutralisé les caméras du quai à 00h55, surpris Gustaf près du jacuzzi à 01h00, l'a assommé et noyé dans l'eau douce, puis a attache un maillon d'ancrage à son corps pour le couler dans le bassin. Il a brisé la montre à 01h12 pour fausser l'heure du décès. La mini-caméra du pont, l'eau douce dans les poumons et ses empreintes de graisse le désignent formellement."
    }
  ];

  /* ================= State ================= */
  let currentCase = null;
  let evidenceList = [];
  let links = [];
  let examined = new Set();
  let attemptsLeft = 3;
  let caseOver = false;
  let started = false;
  let secondsLeft = 0;
  let timerInterval = null;

  const selectScreen = document.getElementById('selectScreen');
  const gameScreen = document.getElementById('gameScreen');
  const caseGrid = document.getElementById('caseGrid');
  const suspectsRow = document.getElementById('suspectsRow');
  const evidenceGrid = document.getElementById('evidenceGrid');
  const svg = document.getElementById('strings');
  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');
  const accSuspect = document.getElementById('accSuspect');
  const accWeapon = document.getElementById('accWeapon');
  const accMotive = document.getElementById('accMotive');
  const accuseBtn = document.getElementById('accuseBtn');
  const attemptsNote = document.getElementById('attemptsNote');
  const verdict = document.getElementById('verdict');

  function initials(name){ return name.split(' ').map(w=>w[0]).join('').slice(0,2); }

  /* ---------- Themes ---------- */
  const THEMES = {
    classic: {
      label: 'Classique', swatch: '#a8241c',
      eyebrow: 'Bureau des Affaires Non Classées',
      title: 'Choisissez votre enquête',
      sub: 'Sept dossiers en attente. Chacun a son propre chrono, ses suspects, ses indices.'
    },
    poirot: {
      label: 'Hercule Poirot', swatch: '#c9a227',
      eyebrow: 'Hercule Poirot — Cabinet de Consultation Privée',
      title: 'Faites travailler vos petites cellules grises',
      sub: "Sept affaires attendent votre méthode et votre ordre. « Ce n'est pas assez de réfléchir — il faut réfléchir juste. »"
    },
    sherlock: {
      label: 'Sherlock Holmes', swatch: '#9c2b1f',
      eyebrow: '221B Baker Street — Salle des Dossiers',
      title: 'Élémentaire, mon cher détective',
      sub: "Sept affaires brumeuses réclament votre sens de l'observation. « Vous voyez, mais vous n'observez pas. »"
    },
    marple: {
      label: 'Miss Marple', swatch: '#b5657a',
      eyebrow: 'St. Mary Mead — Cercle de Lecture',
      title: 'Un peu de thé, beaucoup d\'observation',
      sub: "Sept affaires vous attendent au coin du feu. « Les gens ordinaires cachent souvent les secrets les plus extraordinaires. »"
    },
    'kate-warne': {
      label: 'Kate Warne', swatch: '#a84227',
      eyebrow: 'Pinkerton Agency — National Detective Bureau',
      title: 'Nous ne dormons jamais',
      sub: "Sept enquêtes sous couverture vous attendent. « L'art du déguisement est de ne jamais chercher à être remarqué. »"
    },
    'night-mode': {
      label: 'Mode Nuit', swatch: '#d29922',
      eyebrow: 'Service de Garde — Enquêtes Nocturnes',
      title: 'La nuit porte conseil... et révèle les ombres',
      sub: "Sept dossiers sous la lueur d'une veilleuse. « C'est quand les lumières s'éteignent que la vérité fait le plus de bruit. »"
    }
  };
  let currentTheme = 'classic';

  function renderThemeSwitcher(){
    const el = document.getElementById('themeSwitcher');
    el.innerHTML = '';
    Object.keys(THEMES).forEach(key=>{
      const t = THEMES[key];
      const btn = document.createElement('button');
      btn.className = 'theme-btn' + (key===currentTheme ? ' active' : '');
      btn.innerHTML = `<span class="swatch" style="background:${t.swatch}"></span>${t.label}`;
      btn.addEventListener('click', ()=> setTheme(key));
      el.appendChild(btn);
    });
  }

  function setTheme(key){
    currentTheme = key;
    document.body.dataset.theme = key === 'classic' ? '' : key;
    const t = THEMES[key];
    document.getElementById('selectEyebrow').textContent = t.eyebrow;
    document.getElementById('selectTitle').textContent = t.title;
    document.getElementById('selectSub').textContent = t.sub;
    renderThemeSwitcher();
    drawStrings();
  }

  /* ---------- Select screen ---------- */
  function renderCaseGrid(){
    caseGrid.innerHTML = '';
    CASES.forEach(c=>{
      const card = document.createElement('div');
      card.className = 'case-folder';
      card.setAttribute('data-tab', c.tab);
      card.innerHTML = `
        <div class="case-title">${c.title}</div>
        <div class="case-victim">${c.victimLine}</div>
        <div class="case-teaser">${c.teaser}</div>
        <div class="case-badges">
          <span class="badge">${c.suspects.length} suspects</span>
          <span class="badge">${Math.floor(c.totalSeconds/60)} min</span>
          <span class="badge">${c.difficulty}</span>
        </div>
        <button class="open-btn">Ouvrir le dossier</button>
      `;
      card.querySelector('.open-btn').addEventListener('click', ()=> loadCase(c));
      caseGrid.appendChild(card);
    });
  }

  function showSelectScreen(){
    if (timerInterval){ clearInterval(timerInterval); timerInterval = null; }
    selectScreen.style.display = 'block';
    gameScreen.style.display = 'none';
  }

  /* ---------- Load & render a case ---------- */
  function loadCase(c){
    currentCase = c;
    evidenceList = [...c.baseEvidence];
    c.comboClues.forEach(cc => cc.unlocked = false);
    links = [];
    examined.clear();
    attemptsLeft = c.maxAttempts;
    caseOver = false;
    started = false;
    secondsLeft = c.totalSeconds;

    document.getElementById('caseNum').textContent = c.tab;
    document.getElementById('caseTitle').textContent = c.title;
    document.getElementById('victimLine').textContent = c.victimLine;
    timerDisplay.textContent = formatTime(secondsLeft);
    timerDisplay.classList.remove('urgent');
    startBtn.disabled = false;
    startBtn.textContent = "Démarrer l'enquête";
    verdict.classList.remove('show');
    accuseBtn.disabled = false;
    attemptsNote.innerHTML = `Tentatives restantes : <b>${attemptsLeft}</b> — cliquez « Démarrer l'enquête » pour lancer le chrono.`;

    renderSuspects();
    renderEvidence();
    fillDropdowns();
    updateLinkCounts();

    selectScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    setTimeout(drawStrings, 50);
  }

  function renderSuspects(){
    suspectsRow.innerHTML = '';
    currentCase.suspects.forEach(s=>{
      const card = document.createElement('div');
      card.className = 'suspect-card';
      card.id = 'card-' + s.id;
      card.innerHTML = `
        <div class="avatar" style="background:${s.color}">${initials(s.name)}</div>
        <div class="suspect-name">${s.name}</div>
        <div class="suspect-role">${s.role}</div>
        <div class="suspect-bio">${s.bio}</div>
        <div class="statement-toggle">Voir sa déposition</div>
        <div class="statement-text" id="stmt-${s.id}">${s.statement}</div>
      `;
      card.addEventListener('click', ()=>{ document.getElementById('stmt-'+s.id).classList.toggle('open'); });
      suspectsRow.appendChild(card);
    });
  }

  function renderEvidenceCard(e, isBonus){
    const card = document.createElement('div');
    card.className = 'evidence-card' + (isBonus ? ' bonus' : '');
    card.id = 'card-' + e.id;
    card.innerHTML = `
      <div class="evidence-title">${e.title}${isBonus ? '<span class="new-badge">NOUVEAU</span>' : ''}</div>
      <div class="evidence-preview">${e.preview}</div>
      <div class="evidence-tag">Cliquer pour examiner</div>
      <div class="link-count" id="linkcount-${e.id}"></div>
    `;
    card.addEventListener('click', () => openModal(e));
    evidenceGrid.appendChild(card);
  }

  function renderEvidence(){
    evidenceGrid.innerHTML = '';
    evidenceList.forEach(e => renderEvidenceCard(e, false));
  }

  function fillDropdowns(){
    accSuspect.innerHTML = '<option value="">— Choisir —</option>';
    currentCase.suspects.forEach(s=>{ const o=document.createElement('option'); o.value=s.id; o.textContent=s.name; accSuspect.appendChild(o); });
    accWeapon.innerHTML = '<option value="">— Choisir —</option>';
    currentCase.weapons.forEach(w=>{ const o=document.createElement('option'); o.value=w; o.textContent=w; accWeapon.appendChild(o); });
    accMotive.innerHTML = '<option value="">— Choisir —</option>';
    currentCase.motives.forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=m; accMotive.appendChild(o); });
  }

  /* ---------- Modal ---------- */
  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalLinks = document.getElementById('modalLinks');

  function openModal(e){
    modalTitle.textContent = e.title;
    modalText.textContent = e.text;
    modalLinks.innerHTML = '';
    currentCase.suspects.forEach(s=>{
      const btn = document.createElement('button');
      btn.className = 'link-btn';
      btn.textContent = s.name;
      if (links.some(l=>l.evidenceId===e.id && l.suspectId===s.id)) btn.classList.add('active');
      btn.addEventListener('click', () => toggleLink(e.id, s.id, btn));
      modalLinks.appendChild(btn);
    });
    examined.add(e.id);
    const cardEl = document.getElementById('card-'+e.id);
    if (cardEl) cardEl.classList.add('examined');
    overlay.classList.add('open');
    checkCombos();
  }
  document.getElementById('modalClose').addEventListener('click', ()=> overlay.classList.remove('open'));
  overlay.addEventListener('click', (ev)=>{ if(ev.target===overlay) overlay.classList.remove('open'); });

  function toggleLink(evidenceId, suspectId, btn){
    const idx = links.findIndex(l=>l.evidenceId===evidenceId && l.suspectId===suspectId);
    if (idx>-1){ links.splice(idx,1); btn.classList.remove('active'); }
    else { links.push({evidenceId, suspectId}); btn.classList.add('active'); playPin(); }
    updateLinkCounts();
    drawStrings();
  }

  function updateLinkCounts(){
    evidenceList.forEach(e=>{
      const n = links.filter(l=>l.evidenceId===e.id).length;
      const el = document.getElementById('linkcount-'+e.id);
      if (el) el.textContent = n>0 ? `🧵 relié à ${n} suspect${n>1?'s':''}` : '';
    });
  }

  function checkCombos(){
    currentCase.comboClues.forEach(c=>{
      if (!c.unlocked && c.triggers.every(t=>examined.has(t))){
        c.unlocked = true;
        const newCard = { id:c.id, title:c.title, preview:c.preview, text:c.text, correct:c.correct };
        evidenceList.push(newCard);
        renderEvidenceCard(newCard, true);
        updateLinkCounts();
        playChime();
        showToast(`🧷 Nouvel indice débloqué : « ${c.title} »`);
      }
    });
  }

  function drawStrings(){
    const boardEl = document.querySelector('.board');
    if (!boardEl) return;
    const boardRect = boardEl.getBoundingClientRect();
    svg.setAttribute('width', boardRect.width);
    svg.setAttribute('height', boardRect.height);
    svg.innerHTML = '';
    links.forEach(l=>{
      const evEl = document.getElementById('card-'+l.evidenceId);
      const suEl = document.getElementById('card-'+l.suspectId);
      if(!evEl || !suEl) return;
      const r1 = evEl.getBoundingClientRect();
      const r2 = suEl.getBoundingClientRect();
      const x1 = r1.left - boardRect.left + r1.width/2;
      const y1 = r1.top - boardRect.top;
      const x2 = r2.left - boardRect.left + r2.width/2;
      const y2 = r2.top - boardRect.top + r2.height;
      const midY = (y1+y2)/2 - 30;
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M ${x1} ${y1} Q ${(x1+x2)/2} ${midY}, ${x2} ${y2}`);
      path.setAttribute('stroke', getComputedStyle(document.body).getPropertyValue('--red-string').trim() || '#a8241c');
      path.setAttribute('stroke-width', '1.6');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0.85');
      svg.appendChild(path);
    });
  }
  window.addEventListener('resize', drawStrings);

  function showToast(msg){
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity 0.3s ease';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3600);
  }

  /* ---------- Timer ---------- */
  function formatTime(s){
    const m = Math.floor(s/60); const sec = s % 60;
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  }
  function tickTimer(){
    secondsLeft--;
    timerDisplay.textContent = formatTime(Math.max(secondsLeft,0));
    if (secondsLeft <= 30){ timerDisplay.classList.add('urgent'); playTick(true); }
    else if (secondsLeft % 30 === 0){ playTick(false); }
    if (secondsLeft <= 0){ clearInterval(timerInterval); timerInterval = null; endCase(false, true); }
  }
  startBtn.addEventListener('click', ()=>{
    if (started || caseOver) return;
    started = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Enquête en cours...';
    attemptsNote.innerHTML = `Tentatives restantes : <b>${attemptsLeft}</b>`;
    timerInterval = setInterval(tickTimer, 1000);
  });

  /* ---------- Scoring ---------- */
  function computeScore(solved, timedOut){
    const examinedCount = examined.size;
    let correctLinks = 0, wrongLinks = 0;
    links.forEach(l=>{
      const ev = evidenceList.find(e=>e.id===l.evidenceId);
      if (ev && ev.correct === l.suspectId) correctLinks++; else wrongLinks++;
    });
    const attemptsUsed = currentCase.maxAttempts - attemptsLeft;
    const timeBonus = Math.max(0, Math.floor(secondsLeft/10));
    let total = examinedCount*3 + correctLinks*10 - wrongLinks*4 - attemptsUsed*15 + timeBonus + (solved?50:0) - (timedOut?20:0);
    if (total < 0) total = 0;
    let grade;
    if (solved && total >= 200) grade = "Détective légendaire";
    else if (solved && total >= 130) grade = "Enquêteur aguerri";
    else if (solved) grade = "Limier prometteur";
    else if (total >= 90) grade = "Stagiaire prometteur (affaire non résolue)";
    else grade = "Stagiaire chanceux";
    return { examinedCount, correctLinks, wrongLinks, attemptsUsed, timeBonus, total, grade };
  }

  let investigatorName = '';
  const CARNET_KEY = 'murder-board-carnet-entries';
  const NAME_KEY = 'murder-board-investigator-name';

  function storageAvailable(){
    try{
      const t = '__murder_board_test__';
      localStorage.setItem(t, '1');
      localStorage.removeItem(t);
      return true;
    }catch(e){ return false; }
  }

  function loadInvestigatorName(){
    if (!storageAvailable()) return;
    try{
      const v = localStorage.getItem(NAME_KEY);
      if (v){ investigatorName = v; document.getElementById('investigatorName').value = v; }
    }catch(e){ /* no saved name yet */ }
  }
  document.getElementById('investigatorName').addEventListener('change', (e)=>{
    investigatorName = e.target.value.trim();
    if (!storageAvailable()) return;
    try{ localStorage.setItem(NAME_KEY, investigatorName); }catch(err){}
  });

  function loadCarnet(){
    if (!storageAvailable()) return [];
    try{
      const v = localStorage.getItem(CARNET_KEY);
      return v ? JSON.parse(v) : [];
    }catch(e){ return []; }
  }

  function logCarnetEntry(caseObj, s, solved, timedOut){
    if (!storageAvailable()) return;
    try{
      const list = loadCarnet();
      list.unshift({
        investigator: investigatorName || 'Anonyme',
        caseTitle: caseObj.title,
        solved, timedOut,
        grade: s.grade, score: s.total,
        theme: currentTheme,
        date: new Date().toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
      });
      if (list.length > 300) list.length = 300;
      localStorage.setItem(CARNET_KEY, JSON.stringify(list));
    }catch(e){ }
  }

  function openCarnet(){
    const overlay = document.getElementById('carnetOverlay');
    const statusEl = document.getElementById('carnetStatus');
    const lbEl = document.getElementById('carnetLeaderboard');
    const histEl = document.getElementById('carnetHistory');
    overlay.classList.add('open');

    if (!storageAvailable()){
      statusEl.textContent = "Le carnet n'est pas disponible : votre navigateur bloque le stockage local (mode navigation privée, ou cookies désactivés).";
      lbEl.innerHTML = ''; histEl.innerHTML = '';
      return;
    }
    statusEl.textContent = 'Historique enregistré localement, dans ce navigateur — partagé entre tous ceux qui jouent sur cet appareil.';
    const entries = loadCarnet();

    if (entries.length === 0){
      lbEl.innerHTML = '';
      histEl.innerHTML = '<div class="carnet-empty">Aucune affaire classée pour le moment. Soyez le premier détective à résoudre un dossier !</div>';
      return;
    }

    // Best score per investigator
    const bestByName = {};
    entries.forEach(e=>{
      if (!bestByName[e.investigator] || e.score > bestByName[e.investigator].score){
        bestByName[e.investigator] = e;
      }
    });
    const leaderboard = Object.values(bestByName).sort((a,b)=>b.score-a.score).slice(0,5);

    lbEl.innerHTML = '<div class="carnet-section-title">🏆 Meilleurs enquêteurs</div>' +
      leaderboard.map((e,i)=>`
        <div class="carnet-lb-row">
          <span>${i+1}. <b>${escapeHtml(e.investigator)}</b> — ${escapeHtml(e.caseTitle)}</span>
          <span>${e.score} pts (${escapeHtml(e.grade)})</span>
        </div>
      `).join('');

    histEl.innerHTML = '<div class="carnet-section-title">📜 Historique récent</div>' +
      entries.slice(0,40).map(e=>`
        <div class="carnet-hist-row">
          <span><b>${escapeHtml(e.investigator)}</b> — ${escapeHtml(e.caseTitle)} ${e.solved ? '✅' : '❌'}</span>
          <span>${e.score} pts · ${e.date}</span>
        </div>
      `).join('');
  }

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  document.getElementById('carnetBtn').addEventListener('click', openCarnet);
  document.getElementById('carnetClose').addEventListener('click', ()=> document.getElementById('carnetOverlay').classList.remove('open'));
  document.getElementById('carnetOverlay').addEventListener('click', (ev)=>{
    if (ev.target.id === 'carnetOverlay') document.getElementById('carnetOverlay').classList.remove('open');
  });

  /* ---------- Share summary ---------- */
  function buildShareText(caseObj, s, solved, timedOut){
    const name = investigatorName || 'Un enquêteur anonyme';
    const result = solved ? 'Affaire résolue ✅' : (timedOut ? 'Temps écoulé ❌' : 'Classée sans suite ❌');
    return [
      `🕵️ CARNET D'ENQUÊTE`,
      `Enquêteur : ${name}`,
      `Affaire : ${caseObj.title}`,
      `Résultat : ${result}`,
      `Grade : 🏅 ${s.grade}`,
      `Score : ${s.total} points`,
      `Indices examinés : ${s.examinedCount} | Liens corrects : ${s.correctLinks} | Tentatives utilisées : ${s.attemptsUsed}`,
      ``,
      `Sauras-tu faire mieux ? Teste tes petites cellules grises sur le Bureau des Affaires Non Classées !`
    ].join('\n');
  }

  function scoreHTML(s){
    return `
      <div class="score-box">
        <div class="score-grade">🏅 ${s.grade}</div>
        <div class="score-breakdown">
          Indices examinés : ${s.examinedCount} (+${s.examinedCount*3} pts) —
          Liens corrects : ${s.correctLinks} (+${s.correctLinks*10} pts) —
          Liens erronés : ${s.wrongLinks} (-${s.wrongLinks*4} pts)<br>
          Tentatives utilisées : ${s.attemptsUsed} (-${s.attemptsUsed*15} pts) —
          Bonus de rapidité : +${s.timeBonus} pts
        </div>
        <div class="score-total">Score total : ${s.total} points</div>
      </div>
      <button class="back-btn" id="shareBtn">📋 Copier mon résumé</button>
      <button class="back-btn" id="backToSelect">📁 Choisir une autre enquête</button>
    `;
  }

  function bindBackButton(s, solved, timedOut){
    const backBtn = document.getElementById('backToSelect');
    if (backBtn) backBtn.addEventListener('click', showSelectScreen);
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) shareBtn.addEventListener('click', ()=>{
      const text = buildShareText(currentCase, s, solved, timedOut);
      navigator.clipboard.writeText(text).then(()=>{
        showToast('📋 Résumé copié dans le presse-papier !');
      }).catch(()=>{
        showToast("Impossible de copier automatiquement — sélectionnez le texte manuellement.");
      });
    });
  }

  function endCase(solved, timedOut){
    caseOver = true;
    accuseBtn.disabled = true;
    if (timerInterval){ clearInterval(timerInterval); timerInterval = null; }
    const s = computeScore(solved, timedOut);
    logCarnetEntry(currentCase, s, solved, timedOut);
    if (solved){
      verdict.className = 'verdict show correct';
      verdict.innerHTML = `<span class="verdict-title">Affaire résolue</span>${currentCase.resolutionText}${scoreHTML(s)}`;
      attemptsNote.innerHTML = 'Affaire classée. Bravo, détective.';
      playSuccess();
    } else if (timedOut){
      verdict.className = 'verdict show over';
      verdict.innerHTML = `<span class="verdict-title">Le temps est écoulé</span>Le chrono est arrivé à zéro avant votre accusation finale. L'affaire est classée sans suite, faute de temps.${scoreHTML(s)}`;
      attemptsNote.innerHTML = 'Temps écoulé — dossier classé.';
      playFail();
    } else {
      verdict.className = 'verdict show over';
      verdict.innerHTML = `<span class="verdict-title">L'affaire est classée sans suite</span>Vous avez épuisé vos tentatives. Le juge d'instruction referme le dossier.${scoreHTML(s)}`;
      attemptsNote.innerHTML = 'Tentatives restantes : <b>0</b> — dossier classé.';
      playFail();
    }
    bindBackButton(s, solved, timedOut);
  }

  accuseBtn.addEventListener('click', ()=>{
    if (caseOver) return;
    const s = accSuspect.value, w = accWeapon.value, m = accMotive.value;
    if(!s || !w || !m){
      verdict.className = 'verdict show wrong';
      verdict.innerHTML = '<span class="verdict-title">Dossier incomplet</span>Choisissez un suspect, une arme et un mobile avant d\'accuser.';
      return;
    }
    const sol = currentCase.solution;
    const correctSuspect = s === sol.suspect;
    const correctWeapon = w === sol.weapon;
    const correctMotive = m === sol.motive;
    if ([correctSuspect, correctWeapon, correctMotive].every(Boolean)){ endCase(true, false); return; }

    attemptsLeft--;
    const details = [
      `Suspect : ${correctSuspect ? '✔ correct' : '✘ à revoir'}`,
      `Arme : ${correctWeapon ? '✔ correcte' : '✘ à revoir'}`,
      `Mobile : ${correctMotive ? '✔ correct' : '✘ à revoir'}`
    ].join(' — ');

    if (attemptsLeft <= 0){ endCase(false, false); }
    else{
      verdict.className = 'verdict show wrong';
      verdict.innerHTML = `<span class="verdict-title">Accusation rejetée</span>${details}. Réexaminez les indices — certains se combinent entre eux pour révéler des détails cruciaux.`;
      attemptsNote.innerHTML = `Tentatives restantes : <b>${attemptsLeft}</b>`;
      playFail();
    }
  });

  document.getElementById('resetBtn').addEventListener('click', ()=>{ if (currentCase) loadCase(currentCase); });
  document.getElementById('switchBtn').addEventListener('click', showSelectScreen);

  renderCaseGrid();
  renderThemeSwitcher();
  loadInvestigatorName();
  showSelectScreen();