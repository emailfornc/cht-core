const utils = require('../utils');

describe('view docs_by_replication_key', () => {

  'use strict';

  const documentsToReturn = [
    {
      _id: 'form:doc_by_place_test_form',
      reported_date: 1,
      type: 'form'
    },
    {
      _id: 'report_about_patient',
      reported_date: 1,
      form: 'V',
      type: 'data_record',
      patient_id: 'testpatient'
    },
    {
      _id: 'report_about_patient_2',
      reported_date: 1,
      form: 'V',
      type: 'data_record',
      fields: { patient_id: 'testpatient' }
    },
    {
      _id: 'report_about_place',
      reported_date: 1,
      form: 'V',
      type: 'data_record',
      place_id: 'testplace'
    },
    {
      _id: 'testuser',
      reported_date: 1,
      type: 'person',
      parent: { _id: 'testuserplace' }
    },
    {
      _id: 'testuserplace',
      reported_date: 1,
      type: 'clinic'
    },
    {
      _id: 'test_kujua_message',
      reported_date: 1,
      type: 'data_record',
      kujua_message: true,
      tasks: [
        {
          messages: [
            {
              contact: {
                _id: 'testuser'
              }
            }
          ]
        }
      ]
    },
    {
      _id: 'report_with_contact',
      reported_date: 1,
      form: 'V',
      type: 'data_record',
      contact: {
        _id: 'testuser'
      }
    },
    {
      _id: 'report_with_unknown_patient_id',
      reported_date: 1,
      form: 'V',
      type: 'data_record',
      patient_id: 'unknown_patient',
      contact: {
        _id: 'testuser'
      },
      errors: [ { code: 'registration_not_found' } ]
    },
    {
      _id: 'report_with_invalid_patient_id',
      reported_date: 1,
      form: 'V',
      type: 'data_record',
      patient_id: 'invalid_patient',
      contact: {
        _id: 'testuser'
      },
      errors: [ { code: 'invalid_patient_id' } ]
    },
    {
      _id: 'form:some_deleted_form____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'form:some_deleted_form',
        reported_date: 1,
        type: 'form',
        _deleted: true
      },
    },
    {
      _id: 'report_about_patient_deleted____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'report_about_patient_deleted',
        reported_date: 1,
        form: 'V',
        type: 'data_record',
        patient_id: 'testpatient',
        _deleted: true
      },
    },
    {
      _id: 'report_about_patient_2_deleted____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'report_about_patient_2_deleted',
        reported_date: 1,
        form: 'V',
        type: 'data_record',
        fields: { patient_id: 'testpatient' },
        _deleted: true
      },
    },
    {
      _id: 'report_with_contact_deleted____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'report_with_contact_deleted',
        reported_date: 1,
        form: 'V',
        type: 'data_record',
        contact: {
          _id: 'testuser'
        }
      },
    }, {
      _id: 'needs_signoff_within_branch',
      type: 'data_record',
      contact: { _id: 'user1', parent: { _id: 'parent1', parent: { _id: 'testuserplace' }}},
      fields: { patient_id: 'somepatient', needs_signoff: true },
    },
    {
      _id: 'report_with_patient_uuid',
      type: 'data_record',
      form: 'V',
      contact: { _id: 'someuser' },
      fields: { patient_uuid: 'testpatient' }
    },
    {
      _id: 'task_created_by_user',
      type: 'task',
      user: 'org.couchdb.user:username',
      requester: 'someuser',
      owner: 'testpatient',
    },
    {
      _id: 'target_created_by_user',
      type: 'target',
      user: 'org.couchdb.user:username',
      owner: 'testuser',
    },
  ];

  const documentsToIgnore = [
    {
      _id: 'fakedoctype',
      reported_date: 1,
      type: 'fakedoctype'
    },
    {
      _id: 'not_the_testuser',
      reported_date: 1,
      type: 'person',
    },
    {
      _id: 'test_not_assigned_kujua_message',
      reported_date: 1,
      type: 'data_record',
      kujua_message: true,
      tasks: [
        {
          messages: [
            {
              contact: 'not_the_testuser'
            }
          ]
        }
      ]
    },
    {
      _id: 'test_data_record_wrong_user',
      reported_date: 1,
      type: 'data_record',
      contact: 'not_the_testuser'
    },
    {
      _id: 'fakedoctype_deleted____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'fakedoctype_deleted',
        reported_date: 1,
        type: 'fakedoctype',
        _deleted: true
      }
    },
    {
      _id: 'not_the_testuser_deleted____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'not_the_testuser_deleted',
        reported_date: 1,
        type: 'person',
        _deleted: true
      },
    },
    {
      _id: 'test_data_record_wrong_user_deleted____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'test_data_record_wrong_user_deleted',
        reported_date: 1,
        type: 'data_record',
        contact: 'not_the_testuser',
        _deleted: true
      },
    },
    {
      _id: 'needs_signoff_outside_branch',
      type: 'data_record',
      contact: { _id: 'user2', parent: { _id: 'parent2', parent: { _id: 'not_testuserplace', parent: {}}}},
      fields: { patient_id: 'somepatient', needs_signoff: true },
    },
    {
      _id: 'needs_signoff_within_branch_falsy',
      type: 'data_record',
      contact: { _id: 'user1', parent: { _id: 'parent1', parent: { _id: 'testuserplace' }}},
      fields: { patient_id: 'somepatient', needs_signoff: false },
    },
    {
      _id: 'report_with_patient_uuid_other_patient',
      type: 'data_record',
      contact: { _id: 'someuser' },
      fields: { patient_uuid: 'not_the_testpatient' }
    },
    {
      _id: 'task_created_by_other_user',
      type: 'task',
      user: 'org.couchdb.user:not_username',
      requester: 'someuser',
      owner: 'testpatient',
    },
    {
      _id: 'target_created_by_other_user',
      type: 'target',
      user: 'org.couchdb.user:not_username',
      owner: 'not_someuser',
    },
  ];

  // Should pass filter if unassigned = true
  const documentsToIgnoreSometimes = [
    {
      _id: 'test_kujua_message_no_tasks',
      reported_date: 1,
      type: 'data_record',
      kujua_message: true
    },
    {
      _id: 'test_kujua_message_empty_tasks',
      reported_date: 1,
      type: 'data_record',
      kujua_message: true,
      tasks: []
    },
    {
      _id: 'test_kujua_message_no_contact',
      reported_date: 1,
      type: 'data_record',
      kujua_message: true,
      tasks: [
        {
          messages: []
        }
      ]
    },
    {
      _id: 'test_kujua_message_incoming_no_contact',
      reported_date: 1,
      type: 'data_record'
    },
    {
      _id: 'test_kujua_message_no_tasks_deleted____tombstone',
      type: 'tombstone',
      tombstone: {
        _id: 'test_kujua_message_no_tasks_deleted',
        reported_date: 1,
        type: 'data_record',
        kujua_message: true,
        _deleted: true
      }
    }
  ];

  // TODO: consider removing this and just pulling ids from the two arrays above
  let docByPlaceIds;
  let docByPlaceIds_unassigned;

  beforeAll(() => {
    const alldocs = documentsToReturn.concat(documentsToIgnore, documentsToIgnoreSometimes);

    const getChanges = keys => {
      console.log('Requesting changes, please be patient…');

      return utils.requestOnTestDb({
        path: '/_design/medic/_view/docs_by_replication_key?keys=' + JSON.stringify(keys),
        method: 'GET'
      }).then(response => {
        console.log('…got changes', response);
        return response.rows.map(doc => {
          return doc.id;
        });
      })
        .catch(err => {
          console.log('Error requesting changes', err);
        });
    };

    console.log(`Pushing ${alldocs.length} documents for testing…`);
    return utils.saveDocs(alldocs)
      .then(() => {
        return getChanges(
          ['_all', 'testuser', 'testplace', 'testpatient', 'testuserplace', 'org.couchdb.user:username']
        );
      })
      .then((docs) => {
        docByPlaceIds = docs;
        return getChanges(['_all', '_unassigned', 'testuser', 'testplace', 'testpatient', 'testuserplace' ]);
      })
      .then((docs) => {
        docByPlaceIds_unassigned = docs;
      })
      .catch(err => {
        throw err;
      });
  }, 5 * 60 * 1000);

  afterAll(utils.afterEach);

  it('Does not return the ddoc', () => {
    expect(docByPlaceIds).not.toContain('_design/medic');
  });

  it('Should always return forms', () => {
    expect(docByPlaceIds).toContain('form:doc_by_place_test_form');
  });

  it('should always return form deletes', () => {
    expect(docByPlaceIds).toContain('form:some_deleted_form____tombstone');
  });

  describe('Documents associated with the person id', () => {
    it('Should return clinics if a recursive parent is the user', () => {
      expect(docByPlaceIds).toContain('report_about_patient');
      expect(docByPlaceIds).toContain('report_about_patient_deleted____tombstone');
    });

    it('Should return district_hospitals if the recursive parent is the user', () => {
      expect(docByPlaceIds).toContain('report_about_patient_2');
      expect(docByPlaceIds).toContain('report_about_patient_2_deleted____tombstone');
    });

    it('Should return health_centers if the recursive parent is the user', () => {
      expect(docByPlaceIds).toContain('report_about_place');
    });

    it('Should check the contact of the first message of the first task in kujua messages', () => {
      expect(docByPlaceIds).toContain('test_kujua_message');
      expect(docByPlaceIds).not.toContain('test_not_assigned_kujua_message');
    });

    it('Should check the contact of data records', () => {
      expect(docByPlaceIds).toContain('report_with_contact');
      expect(docByPlaceIds).not.toContain('test_data_record_wrong_user');

      expect(docByPlaceIds).toContain('report_with_contact_deleted____tombstone');
      expect(docByPlaceIds).not.toContain('test_data_record_wrong_user_deleted____tombstone');
    });

    it('Falls back to contact id when unknown patient', () => {
      expect(docByPlaceIds).toContain('report_with_unknown_patient_id');
    });

    it('should check for patient_uuid', () => {
      expect(docByPlaceIds).toContain('report_with_patient_uuid');
      expect(docByPlaceIds).not.toContain('report_with_patient_uuid_other_patient');
    });

    it('Falls back to contact id when invalid patient', () => {
      expect(docByPlaceIds).toContain('report_with_invalid_patient_id');
    });

    it('should return data_records with needs_signoff from same branch', () => {
      expect(docByPlaceIds).toContain('needs_signoff_within_branch');
      expect(docByPlaceIds).not.toContain('needs_signoff_within_branch_falsy');
      expect(docByPlaceIds).not.toContain('needs_signoff_outside_branch');
    });

    it('should return target docs', () => {
      expect(docByPlaceIds).toContain('target_created_by_user');
      expect(docByPlaceIds).not.toContain('target_created_by_other_user');
    });
  });

  describe('Documents associated with user id', () => {
    it('should return task docs', () => {
      expect(docByPlaceIds).toContain('task_created_by_user');
      expect(docByPlaceIds).not.toContain('task_created_by_other_user');
    });
  });

  describe('Documents that only pass when unassigned == true', () => {
    it('Should pass when no tasks', () => {
      expect(docByPlaceIds_unassigned).toContain('test_kujua_message_no_tasks');
      expect(docByPlaceIds).not.toContain('test_kujua_message_no_tasks');

      expect(docByPlaceIds_unassigned).toContain('test_kujua_message_no_tasks_deleted____tombstone');
      expect(docByPlaceIds).not.toContain('test_kujua_message_no_tasks_deleted____tombstone');
    });

    it('Should pass when empty tasks', () => {
      expect(docByPlaceIds_unassigned).toContain('test_kujua_message_empty_tasks');
      expect(docByPlaceIds).not.toContain('test_kujua_message_empty_tasks');
    });

    it('Should pass when no contact', () => {
      expect(docByPlaceIds_unassigned).toContain('test_kujua_message_no_contact');
      expect(docByPlaceIds).not.toContain('test_kujua_message_no_contact');
    });

    it('Should pass when no contact (incoming)', () => {
      expect(docByPlaceIds_unassigned).toContain('test_kujua_message_incoming_no_contact');
      expect(docByPlaceIds).not.toContain('test_kujua_message_incoming_no_contact');
    });
  });

  // TODO: test these branches:
  //  - OK() no query id
});