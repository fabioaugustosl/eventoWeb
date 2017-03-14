
eventoApp.factory('statsService', function(){
	return {
		resumeData : 
		[
			{
				name : 'Ingressos',
				classImg : 'ti-server',
				classImgStatus : 'icon-warning',
				value : '1045',
				infoUpdate : 'Atualizado agora',
				classIcon: 'ti-reload'
			},
			{
				name : 'Arrecadação',
				classImg : 'ti-wallet',
				classImgStatus : 'icon-success',
				value : 'R$1,345',
				infoUpdate : 'Ultimo dia',
				classIcon: 'ti-calendar'
			},
			{
				name : 'Reclamações',
				classImg : 'ti-pulse',
				classImgStatus : 'icon-danger',
				value : '23',
				infoUpdate : 'No último dia',
				classIcon: 'ti-timer'
			},
			{
				name : 'Curtidas',
				classImg : 'ti-twitter-alt',
				classImgStatus : 'icon-info',
				value : '+45',
				infoUpdate : 'Atualizado agora',
				classIcon: 'ti-reload'
			}
		]
	};
});